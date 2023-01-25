import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { nanoid } from 'nanoid'

import { initalPostList } from 'constants/blog'
import { Post } from 'types/blog.type'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}
const initialState: BlogState = {
  postList: initalPostList,
  editingPost: null
}
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // when dispath not push id to postList, it will null. should use prepare
    // addPost: (state, action: PayloadAction<Omit<Post, 'id'>>) => {
    //   const post = action.payload
    //   state.postList.push({
    //     ...post,
    //     id: nanoid()
    //   })
    // },
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        const post = action.payload
        state.postList.push(post)
      },
      prepare: (post: Omit<Post, 'id'>) => {
        return {
          payload: {
            ...post,
            id: nanoid()
          }
        }
      }
    },
    deletePost: (state, action) => {
      const postId = action.payload
      const foundPostIndex = state.postList.findIndex((post) => post.id === postId)
      if (foundPostIndex !== -1) {
        state.postList.splice(foundPostIndex, 1)
      }
    },
    startEditingPost: (state, action) => {
      const postId = action.payload
      const foundPost = state.postList.find((post) => post.id === postId) || null
      state.editingPost = foundPost
    },
    cancelEditingPost: (state) => {
      state.editingPost = null
    },
    finishEditingPost: (state, action: PayloadAction<Post>) => {
      const postId = action.payload.id
      state.postList.some((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload
          return true
        }
        return false
      })
    }
  }
})
export const { addPost, deletePost, startEditingPost, cancelEditingPost, finishEditingPost } = blogSlice.actions
export default blogSlice.reducer
