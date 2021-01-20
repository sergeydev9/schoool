import React from 'react'
import Dropdown from 'Shared/Dropdown'
import useToggle from 'utils/useToggle'
import { Post } from 'Post/types'
import style from './style.module.css'
import PostForm from 'Post/Form'
import DeleteModal from 'Shared/Modal/Delete'
import api from 'api'
import { PostStore } from 'Post/Store'
import SavePostModal from 'Post/Item/Menu/SavePostModal'
import { observer } from 'mobx-react-lite'

const itemClass = `w-full flex-center transition duration-200 hover:bg-gray-f2 cursor-pointer ${style.menuItem}`

type Props = {
  post: Post
  button: (params: { onClick(): void }) => React.ReactNode
  className?: string
}

export default observer(function Menu({ post, button, className }: Props) {
  const [isOpen, setOpen] = React.useState(false)
  const [showPostForm, togglePostForm] = useToggle()
  const [showDeleteModal, toggleDeleteModal] = useToggle()
  const [showShare, toggleShare] = useToggle()
  const [savePostOpen, toggleSavePost] = useToggle()
  const { isMine, isClassOwner, isClassAdmin } = post

  const close = () => setOpen(false)

  return (
    <>
      {showPostForm && <PostForm post={post} onClose={togglePostForm} />}
      {showShare && (
        <PostForm post={{ sharedPost: post }} onClose={toggleShare} />
      )}
      {showDeleteModal && (
        <DeleteModal
          onClose={toggleDeleteModal}
          onDelete={() => {
            api.post.remove({ id: post.id })
            PostStore.remove(post)
          }}
        />
      )}
      {savePostOpen && (
        <SavePostModal
          post={post}
          onClose={() => {
            toggleSavePost()
            close()
          }}
        />
      )}
      <Dropdown
        isOpen={isOpen}
        setOpen={setOpen}
        button={button}
        className={className}
        contentClass="absolute mt-2 rounded-lg shadow-around bg-white right-0 z-20 text-17 font-bold"
      >
        {!isMine && <div className={`${itemClass}`}>Send Message</div>}
        {!isMine && <div className={`${itemClass} text-blue-deep`}>Follow</div>}
        <div onClick={toggleSavePost} className={`${itemClass} text-blue-deep`}>
          {post.addedToSaved ? 'Remove from Saved' : 'Save Post'}
        </div>

        {!isMine && (
          <div className={`${itemClass}`} onClick={toggleShare}>
            Share This Post
          </div>
        )}
        {!isMine && <div className={`${itemClass} text-blue-deep`}>Report</div>}
        {isMine && (
          <button
            type="button"
            className={`${itemClass} text-blue-deep`}
            onClick={togglePostForm}
          >
            Edit
          </button>
        )}
        {(isMine || isClassOwner || isClassAdmin) && (
          <div
            className={`${itemClass} text-red-500`}
            onClick={toggleDeleteModal}
          >
            Delete
          </div>
        )}
        {isMine && (
          <div className={`${itemClass}`} onClick={toggleShare}>
            Share This Post
          </div>
        )}
      </Dropdown>
    </>
  )
})
