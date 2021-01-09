import React from 'react'
import { X } from '@styled-icons/boxicons-regular/X'
import cn from 'classnames'
import { observer } from 'mobx-react-lite'
import SelectTarget from 'Post/Form/SelectTarget'
import { CaretDown } from '@styled-icons/boxicons-regular/CaretDown'
import YouTube from 'Post/Form/YouTube'
import ImagePreviews from 'Post/Form/ImagePreviews'
import SentenceForm from 'Post/Form/SentenceForm'
import Sentence from 'Home/Sentence'
import TagModal from 'Post/Form/TagModal'
import RecordAudio from 'Post/Form/RecordAudio'
import LoopingAudioModal from 'Post/Form/LoopingAudio'
import { createFormState } from 'Post/Form/State'
import FormTextarea from 'Post/Form/Textarea'
import submit from 'Post/Form/submit'
import useImageUploadState from 'utils/imageUploadState'
import useVideoUploadState from 'utils/videoUploadState'
import VideoPreview from 'Post/Form/VideoPreview'
import useYouTubeState from 'utils/youTubeState'
import Audio from 'Post/Item/Audio'
import AddMediaPanel from 'Post/Form/AddMediaPanel'
import Modal from 'Shared/Modal'
import Zoom from 'Post/Form/Zoom'
import Link from 'Post/Item/Link'
import { useOnChangeSelectionRange } from 'utils/contentEditable'

type Props = {
  onClose(): void
}

export default observer(function PostFormModal({ onClose }: Props) {
  const [state] = React.useState(() => createFormState())

  useOnChangeSelectionRange((range) => state.setSelectionRange(range))

  const youTubeState = useYouTubeState({
    close: true,
    className: 'mt-4',
    onChange(id) {
      state.setYouTubeId(id)
    },
  })

  const imageUploadState = useImageUploadState({
    onChange: (images) => state.setImages(images),
  })

  const videoUploadState = useVideoUploadState({
    onChange: (video) => state.setVideo(video),
  })

  React.useEffect(() => {
    window.onbeforeunload = () => 'Changes you made may not be saved.'
    return () => {
      window.onbeforeunload = null
    }
  })

  return (
    <>
      {state.currentScreen === 'tag' && <TagModal state={state} />}
      <Modal
        onClose={onClose}
        width={550}
        className="relative"
        hidden={state.currentScreen === 'tag'}
      >
        {state.currentScreen === 'privacy' && <SelectTarget state={state} />}
        {state.currentScreen === 'youtube' && (
          <YouTube
            youtubeId={youTubeState.youtubeId}
            youtubeState={youTubeState}
            onClose={() => state.backToForm()}
          />
        )}
        {state.currentScreen === 'sentence' && <SentenceForm state={state} />}
        {state.currentScreen === 'audio' && <RecordAudio state={state} />}
        {state.currentScreen === 'loopingAudio' && (
          <LoopingAudioModal state={state} />
        )}
        {state.currentScreen === 'zoom' && <Zoom state={state} />}
        {(state.currentScreen === 'form' || state.currentScreen === 'tag') && (
          <div>
            {imageUploadState.warningModal}
            {imageUploadState.dragArea}
            <button
              type="button"
              className="absolute top-0 right-0 text-gray-5f mt-8 mr-6"
              onClick={onClose}
            >
              <X size={32} />
            </button>
            <div className="text-2xl uppercase text-center pt-8 pb-6 border-b border-gray-c5">
              Create
            </div>
            <div
              className={cn(
                'p-6',
                imageUploadState.hasPreviews ||
                  youTubeState.video ||
                  videoUploadState.url
                  ? 'pb-0'
                  : 'border-b border-gray-c5',
              )}
            >
              <div className="flex">
                <button
                  type="button"
                  className="w-1/2 bg-gray-f7 flex items-center justify-between px-5 text-xl h-10 rounded-full border border-gray-8b block relative z-30"
                  onClick={() => state.setCurrentScreen('privacy')}
                >
                  {state.values.privacy}
                  <CaretDown size={24} />
                </button>
                <button
                  type="button"
                  className={cn(
                    'w-1/2 ml-7 bg-blue-primary text-white h-10 rounded-full font-bold flex-center',
                    !state.isValid && 'opacity-25',
                  )}
                  disabled={!state.isValid}
                  onClick={() => {
                    onClose()
                    submit({ state })
                  }}
                >
                  Post
                </button>
              </div>

              <FormTextarea state={state} />

              {state.values.audio && (
                <Audio
                  src={state.values.audio.url}
                  className="mt-4"
                  onDelete={() => state.setAudio()}
                />
              )}

              {state.values.loopingAudio && (
                <Audio
                  src={state.values.loopingAudio}
                  loop
                  className="mt-4"
                  onDelete={() => state.setLoopingAudio()}
                />
              )}

              {state.values.notebookSentence && (
                <Sentence state={state} className="mt-4" />
              )}

              {state.values.links && state.values.links.length > 0 && (
                <div className="mt-4">
                  {state.values.links?.map((link, i) => (
                    <Link
                      className={i !== 0 ? 'mt-4' : undefined}
                      link={link}
                      key={i}
                      onDelete={() =>
                        state.setLinks(
                          state.values.links.filter((item) => item !== link),
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {youTubeState.video}

            {videoUploadState.url && (
              <VideoPreview
                video={videoUploadState.url}
                removeVideo={() => videoUploadState.setVideo(undefined)}
                className="mt-4"
              />
            )}

            <ImagePreviews
              images={imageUploadState.images}
              removeImage={(image) => imageUploadState.removeImage(image)}
            />

            <AddMediaPanel
              state={state}
              imageUploadState={imageUploadState}
              videoUploadState={videoUploadState}
            />
          </div>
        )}
      </Modal>
    </>
  )
})
