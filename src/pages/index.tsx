import { useEffect, useLayoutEffect, useState } from "react";
import micIcon from "@src/icons/microphone-solid.svg";
import { LiveAudioVisualizer } from "react-audio-visualize";
import Image from "next/image";
import classNames from "classnames";
import Head from "next/head";
import Header from "@src/components/header";
import Footer from "@src/components/footer";

interface MediaRecorderWithChunk extends MediaRecorder {
    chunks: Blob[];
}
type AudioState = { data: Blob; time: Date }[];
function getCurrentTime(time: Date) {
    const ampm = time.getHours() >= 12 ? "PM" : "AM";
    const hours = String(time.getHours() % 12 || 12).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes} ${ampm}`;
}

export default function Home() {
    const [Audios, setAudios] = useState<AudioState>([]);
    const [curMedia, setCurMedia] = useState<MediaRecorderWithChunk>();
    const [stream, setStream] = useState<MediaStream>();
    const [devices, setDevices] = useState<MediaDeviceInfo[]>();
    async function askGetMedia() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("MediaRecorder is not supported in this browser.");
            return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const microphones = devices.filter(
            (device) => device.kind === "audioinput" && device.deviceId != ""
        );
        setStream(stream);
        setDevices(microphones);
        return microphones;
    }
    useLayoutEffect(() => {
        askGetMedia().then();
    }, []);
    function startRecording() {
        if (!devices || devices.length == 0) {
            askGetMedia().then();
            return;
        }
        if (!stream) return alert("Please choose a device first");
        if (curMedia) return;
        // Check if the browser supports MediaRecorder
        const mediaRecorder: MediaRecorderWithChunk = new MediaRecorder(
            stream
        ) as any;
        mediaRecorder.chunks = [];

        setCurMedia(mediaRecorder);
        // Event handler for data available
        mediaRecorder.ondataavailable = function (e) {
            mediaRecorder.chunks.push(e.data);
        };

        // Event handler for stopping recording
        mediaRecorder.onstop = function () {
            // Combine recorded chunks into a single Blob
            const blob = new Blob(mediaRecorder.chunks, { type: "audio/wav" });
            setCurMedia(undefined);
            setAudios((pre) => [...pre, { data: blob, time: new Date() }]);
        };

        // Start recording
        mediaRecorder.start();

        // Request access to the microphone
    }
    useEffect(() => {
        if (curMedia && stream && curMedia.stream.id != stream.id) {
            curMedia.stop();
        }
    }, [stream]);
    return (
        <>
            <Head>
                <title>Speech Recorder</title>
            </Head>
            <Header />
            <main className="wrapper min-h-screen my-3">
                <section>
                    <p className="directions text-center text-lg mb-4">
                        The Self-Recording Language Learning Tool is a web
                        application designed to aid language learners in
                        improving their language skills through self-recording
                        and reflection. Leveraging the power of audio recording,
                        this tool enables users to practice speaking in their
                        target language, track their progress, and refine their
                        pronunciation, fluency, and vocabulary.
                    </p>
                    <div>
                        {devices &&
                            devices.map((mic) => {
                                return (
                                    <label
                                        className={classNames(
                                            "p-1 px-2 my-1 border-2 border-solid border-blue-400 flex items-center cursor-pointer gap-3",
                                            "hover:text-blue-600",
                                            "relative after:content-[''] after:bg-red-600 after:rounded-full after:w-3 after:aspect-square after:absolute after:-left-5 rtl:after:left-auto rtl:after:-right-5",
                                            "after:hidden aria-selected:after:block"
                                        )}
                                        aria-selected={
                                            mic.deviceId ==
                                            stream
                                                ?.getAudioTracks()[0]
                                                .getSettings().deviceId
                                        }
                                        key={mic.deviceId}
                                    >
                                        <Image
                                            src={micIcon}
                                            alt=""
                                            width={10}
                                            height={10}
                                        />
                                        <p className="flex-1">{mic.label}</p>
                                        <button
                                            className="appearance-none absolute invisible"
                                            onClick={() => {
                                                navigator.mediaDevices
                                                    .getUserMedia({
                                                        audio: {
                                                            deviceId: {
                                                                exact: mic.deviceId,
                                                            },
                                                        },
                                                    })
                                                    .then((mic) => {
                                                        setStream(mic);
                                                    });
                                            }}
                                        ></button>
                                    </label>
                                );
                            })}
                    </div>
                    <div className="progress-display"></div>
                </section>
                <section className="main-controls">
                    {curMedia && (
                        <LiveAudioVisualizer
                            className="visualizer"
                            mediaRecorder={curMedia}
                            width={500}
                            height={75}
                            barWidth={1}
                            gap={0}
                            barColor={"#f76565"}
                        />
                    )}

                    <div id="buttons">
                        <button
                            className="btn record"
                            onClick={startRecording}
                        >
                            Record
                        </button>
                        <button
                            className="btn stop "
                            disabled={curMedia == undefined}
                            onClick={() => {
                                if (curMedia) curMedia.stop();
                            }}
                        >
                            Stop
                        </button>
                        {/* <button className="upload">Upload</button> */}
                    </div>
                </section>
                <section className="sound-clips">
                    {Audios.reverse().map(({ data: blob, time }) => {
                        const url = URL.createObjectURL(blob);
                        return (
                            <article
                                className="clip my-3"
                                key={url}
                            >
                                <audio
                                    controls
                                    src={url}
                                    className="w-full block mb-1"
                                ></audio>
                                <div className="px-2 flex">
                                    <div className="flex-1">
                                        <p>{getCurrentTime(time)}</p>
                                    </div>
                                    <button
                                        className="btn delete"
                                        onClick={() => {
                                            setAudios((pre) =>
                                                pre.filter(
                                                    (c) => c.data != blob
                                                )
                                            );
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </section>
            </main>
  
            <Footer />
        </>
    );
}
