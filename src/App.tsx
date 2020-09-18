import * as React from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'

import { createConnection, getConnection, getRepository } from 'typeorm/browser'
import { Post } from './models/post'

export default function App() {
  const [body, setBody] = React.useState<string>('')
  const [posts, setPosts] = React.useState<Post[]>([])

  function connect() {
    try {
      return getConnection()
    } catch (error) {
      return createConnection({
        database: 'example',
        driver: require('expo-sqlite'),
        entities: [Post],
        synchronize: true,
        type: 'expo',
      })
    }
  }

  async function createPost(): Promise<Post | null> {
    if (body.length === 0) {
      return null
    }

    const post = new Post()
    post.body = body

    const postRepository = getRepository(Post)
    const createdPost = await postRepository.save(post)

    setBody('')

    await fetchPosts()
    return createdPost
  }

  async function fetchPosts(): Promise<void> {
    try {
      const postRepository = getRepository(Post)
      const posts = await postRepository.find()

      setPosts(posts)
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }

  React.useEffect(() => {
    const bootstrap = async () => {
      await connect()

      fetchPosts()
    }

    bootstrap()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.createPost}>
        <TextInput
          style={[styles.input, styles.body]}
          value={body}
          onChangeText={(body) => setBody(body)}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={createPost}>
          <Text style={styles.buttonText}>Publish</Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.list}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {posts?.map((post) => (
            <View key={post.id} style={styles.post}>
              <Text>{post.body}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: Constants.statusBarHeight,
    padding: 25,
  },

  createPost: {
    width: '100%',
    marginTop: 50,
  },

  input: {
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFAD1E',
  },

  body: {
    height: 100,
    marginTop: 15,
  },

  button: {
    marginTop: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#FFAD1E',
  },

  buttonText: {
    color: '#FFFFFF',
  },

  list: {
    width: '100%',
    marginTop: 20,
  },

  post: {
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#38444D',
  },

  postBody: {
    color: '#14181A',
  },
})
