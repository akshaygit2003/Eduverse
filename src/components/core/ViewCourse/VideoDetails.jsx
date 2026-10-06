/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "video-react/dist/video-react.css";
import { BigPlayButton, Player } from "video-react";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { BiSkipPrevious, BiSkipNext, BiCheckCircle } from "react-icons/bi";
import { FiRotateCcw } from "react-icons/fi";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState(null);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!courseSectionData?.length) return;
      if (!courseId || !sectionId || !subSectionId) {
        navigate(`/dashboard/enrolled-courses`);
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        );
        const filteredVideoData = filteredData?.[0]?.subSection?.filter(
          (data) => data._id === subSectionId
        );
        if (filteredVideoData?.length) {
          setVideoData(filteredVideoData[0]);
        }
        setPreviewSource(courseEntireData?.thumbnail);
        setVideoEnded(false);
      }
    })();
  }, [courseSectionData, courseEntireData, location.pathname]);

  // Keyboard Shortcuts Handler (Space: Pause/Play, Arrow Left/Right: Seek)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger when user is typing in input or textarea
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

      if (!playerRef.current) return;
      const playerState = playerRef.current.getState().player;

      if (e.code === "Space") {
        e.preventDefault();
        if (playerState.paused) {
          playerRef.current.play();
        } else {
          playerRef.current.pause();
        }
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        playerRef.current.seek(playerState.currentTime + 5);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        playerRef.current.seek(Math.max(0, playerState.currentTime - 5));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isFirstVideo = () => {
    if (!courseSectionData?.length) return true;
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    if (currentSectionIndx === -1) return true;
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ]?.subSection?.findIndex((data) => data._id === subSectionId);
    return currentSectionIndx === 0 && currentSubSectionIndx === 0;
  };

  const isLastVideo = () => {
    if (!courseSectionData?.length) return true;
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    if (currentSectionIndx === -1) return true;
    const noOfSubsections =
      courseSectionData[currentSectionIndx]?.subSection?.length || 0;
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ]?.subSection?.findIndex((data) => data._id === subSectionId);

    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    );
  };

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubsections =
      courseSectionData[currentSectionIndx]?.subSection?.length || 0;
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ]?.subSection?.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else if (currentSectionIndx < courseSectionData.length - 1) {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id;
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id;
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      );
    }
  };

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ]?.subSection?.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      );
    } else if (currentSectionIndx > 0) {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id;
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length;
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    );
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 text-white max-w-5xl mx-auto p-4">
      <div className="relative overflow-hidden rounded-2xl border border-richblack-700 bg-richblack-800 shadow-2xl">
        {!videoData ? (
          <img
            src={previewSource}
            alt="Preview"
            className="h-full w-full rounded-2xl object-cover"
          />
        ) : (
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          >
            <BigPlayButton position="center" />
            {videoEnded && (
              <div
                className="absolute inset-0 z-[100] grid h-full place-content-center bg-richblack-900/90 backdrop-blur-md font-inter p-6 transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <h3 className="text-2xl font-bold text-richblack-25">Lecture Completed! 🎉</h3>
                  {!completedLectures.includes(subSectionId) && (
                    <button
                      disabled={loading}
                      onClick={handleLectureCompletion}
                      className="flex items-center gap-2 rounded-xl bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 transition-all hover:bg-yellow-25 hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <BiCheckCircle className="text-xl" />
                      {!loading ? "Mark As Completed" : "Saving..."}
                    </button>
                  )}
                  <button
                    disabled={loading}
                    onClick={() => {
                      if (playerRef?.current) {
                        playerRef?.current?.seek(0);
                        playerRef?.current?.play();
                        setVideoEnded(false);
                      }
                    }}
                    className="flex items-center gap-2 rounded-xl border border-richblack-600 bg-richblack-800 px-5 py-2.5 font-medium text-richblack-100 hover:bg-richblack-700 hover:text-white transition-all"
                  >
                    <FiRotateCcw /> Rewatch
                  </button>
                  
                  <div className="mt-6 flex items-center gap-4">
                    {!isFirstVideo() && (
                      <button
                        disabled={loading}
                        onClick={goToPrevVideo}
                        className="flex items-center gap-1 rounded-xl border border-richblack-700 bg-richblack-800 px-4 py-2 text-sm font-medium text-richblack-100 hover:bg-richblack-700"
                      >
                        <BiSkipPrevious className="text-xl" /> Previous Lecture
                      </button>
                    )}
                    {!isLastVideo() && (
                      <button
                        disabled={loading}
                        onClick={goToNextVideo}
                        className="flex items-center gap-1 rounded-xl bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 hover:bg-yellow-25"
                      >
                        Next Lecture <BiSkipNext className="text-xl" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Player>
        )}
      </div>

      {/* Video Details Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-richblack-800 pb-6 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-richblack-25">{videoData?.title || "Lecture"}</h1>
          <p className="mt-2 text-sm text-richblack-200 leading-relaxed max-w-3xl">
            {videoData?.description}
          </p>
        </div>

        {/* Quick Navigation Control Bar */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {!isFirstVideo() && (
            <button
              onClick={goToPrevVideo}
              className="flex items-center gap-1 rounded-lg border border-richblack-700 bg-richblack-800 px-3 py-1.5 text-xs font-medium text-richblack-100 hover:bg-richblack-700 transition-colors"
            >
              <BiSkipPrevious className="text-lg" /> Prev
            </button>
          )}
          {!isLastVideo() && (
            <button
              onClick={goToNextVideo}
              className="flex items-center gap-1 rounded-lg border border-yellow-100/50 bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-100 hover:bg-yellow-500/20 transition-colors"
            >
              Next <BiSkipNext className="text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-richblack-400 bg-richblack-800/40 border border-richblack-800 rounded-xl p-3">
        <span className="font-semibold text-richblack-200">⌨️ Player Shortcuts:</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-richblack-700 text-richblack-100">Space</kbd> Play / Pause</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-richblack-700 text-richblack-100">←</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-richblack-700 text-richblack-100">→</kbd> Seek 5s</span>
      </div>
    </div>
  );
};

export default VideoDetails;
