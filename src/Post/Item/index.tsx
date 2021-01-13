import React from 'react'
import style from 'Home/style.module.css'
import { Post as PostType } from 'Post/types'
import cn from 'classnames'
import ReadMore from 'Post/Item/ReadMore'
import useToggle from 'utils/useToggle'
import Menu from 'Post/Item/Menu'
import { DotsHorizontalRounded } from '@styled-icons/boxicons-regular/DotsHorizontalRounded'
import CommentForm from 'Post/Comment/Form'
import Attachments from 'Post/Attachments'
import Spin from 'assets/images/icons/Spin'
import { formatDate } from 'utils/date'
import Text from 'Post/Item/Text'
import { observer } from 'mobx-react-lite'
import PostBottomPanel from 'Post/Item/BottomPanel'

type Props = {
  post: PostType
}

export default observer(function Post({ post }: Props) {
  const textRef = React.useRef(null)
  const [showFullText, toggleShowFullText] = useToggle()

  return (
    <div className="bg-white shadow relative mb-5">
      <Menu
        post={post}
        button={({ onClick }) => (
          <button type="button" onClick={onClick}>
            <DotsHorizontalRounded size={24} />
          </button>
        )}
        className="absolute top-0 right-0 mt-8 mr-5"
      />

      <div className="px-5 pt-5">
        {(post.isUploading || post.error) && (
          <div
            className={cn(
              'flex-center mb-4',
              post.error ? 'text-red-600' : 'text-blue-primary',
            )}
          >
            {!post.error && <Spin className="animate-spin h-5 w-5 mr-3" />}
            <div
              className={cn(
                'text-xl font-bold text-center',
                !post.error && 'animate-pulse',
              )}
            >
              {post.error || 'Uploading'}
            </div>
          </div>
        )}

        <div className="flex-center mb-3">
          <img
            src={post.user.avatar}
            alt="avatar"
            style={{ width: '60px', height: '60px' }}
            className="mr-3 rounded-full"
          />
          <div className="flex-grow">
            <div className="text-xl text-gray-02">{post.user.name}</div>
            <div className="font-bold text-gray-b0 text-sm">
              {formatDate(post.date)}
            </div>
          </div>
        </div>

        <Text post={post} textRef={textRef} showFullText={showFullText} />

        <div className="flex items-end">
          {post.notebookSentence && (
            <div className="flex-grow">
              <div className={`text-blue-primary uppercase mb-1 ${style.text}`}>
                Send to notebook
              </div>

              <div className={`text-gray-87 uppercase mb-1 ${style.text}`}>
                {post.notebookSentence.text}
              </div>

              <div
                className={`text-gray-87 uppercase mb-1 font-bold font-italic ${style.text}`}
              >
                {post.notebookSentence.translation}
              </div>
            </div>
          )}
          <div className="whitespace-no-wrap">
            <ReadMore
              showFullText={showFullText}
              toggleShowFullText={toggleShowFullText}
              post={post}
              textRef={textRef}
            />
          </div>
        </div>
      </div>

      <Attachments
        audioClass="px-5 pt-5"
        linkClass="mx-5 mt-5"
        imageClass="w-full mt-5"
        videoClass="mt-5"
        attachments={post}
      />

      <PostBottomPanel post={post} />

      <CommentForm
        post={post}
        className="pt-6 pb-3 pl-5 pr-8 flex-center"
        minHeight={28}
      />
    </div>
  )
})