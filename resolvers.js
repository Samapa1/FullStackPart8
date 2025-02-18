const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
    Query: {
      bookCount: async () => Book.collection.countDocuments,
      authorCount: async () => Author.collection.countDocuments,
      allBooks: async (root, args) => {
        if (args.author && args.genre){
          const author2 = await Author.find({name: args.author})
          const books = await Book.find({ author: author2, genres: args.genre }).populate({path: "author"})
          return books
        }
        else if (args.author && !args.genre){
          const author2 = await Author.find({name: args.author})
          const books = await Book.find({ author: author2}).populate({path: "author"})
          return books
        }
        else if (!args.author && args.genre) {
          const books =  Book.find({ genres: args.genre }).populate({path: "author"})
          return books
        }
        else {
          const books = await Book.find({}).populate({path: "author"})
          return books
        }
        },
  
      allAuthors: async (root, args) => {
        return Author.find({})
      },
      me: (root, args, context) => {
        return context.currentUser
      }
    },
  
    Author: {
      bookCount: async (root) => {
        const result = await Author.find({name: root.name} ).populate('books') 
        return result[0].books.length
      }
    },
  
    Mutation: {
      addBook: async (root, args, context) => {
        const author = await Author.findOne({name: args.author})
        const currentUser = context.currentUser
         if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
  
        try {
  
        if (author) {
          const book = new Book( {...args, author: author, id: uuid()} )
          await book.save()
          author.books.push(book)
          await author.save({
            validateModifiedOnly: true,
          })
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return book
        }
        else {
          const newAuthor = new Author( {
            name: args.author,
            id: uuid(),
            born: null
          })
          await newAuthor.save()
          const book = new Book( {...args, author: newAuthor, id: uuid()} )
          const author = await Author.findOne({name: args.author})
          author.books.push(book)
          await author.save()
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return book.save()
  
        }
        } catch (error) {
            console.log(error.errors.name)
            throw new GraphQLError('Adding book failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.name,
                error
              }
            })
        }
  
      },
  
      editAuthor: async (root, args, context) => {
        const author = await Author.findOne({name: args.name})
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
  
        try {
          if (author){
            author.born = args.setBornTo
            await author.save()
            return author
          }
          return
        } catch {
            console.log("error")
            console.log(error.errors.name)
            throw new GraphQLError('Editing author failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.name,
                error
              }
            })
        }
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
    
        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.username,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })        
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }
    
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      }
    },

    Subscription: {
        bookAdded: {
          subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        },
      },
    
  }

module.exports = resolvers