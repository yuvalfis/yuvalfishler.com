"use client";

import { useEffect, useRef, useState } from "react";

import { chiptuneTracks } from "./data";
import styles from "./retro.module.css";
import { useReducedMotion } from "./useReducedMotion";

type ChiptunePlayerProps = {
  hasEntered: boolean;
};

/** A real WebAudio chiptune sequencer standing in for the "MIDI in the left frame". */
export default function ChiptunePlayer({ hasEntered }: ChiptunePlayerProps) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pulse, setPulse] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const stepRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulsedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  const ensureContext = () => {
    if (!audioCtxRef.current) {
      try {
        const AudioContextCtor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = AudioContextCtor ? new AudioContextCtor() : null;
      } catch {
        audioCtxRef.current = null;
      }
    }
    return audioCtxRef.current;
  };

  const playNote = (frequency: number, durationMs: number) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !frequency) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + durationMs / 1000);
  };

  const stopSequence = () => {
    setPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startSequence = () => {
    const ctx = ensureContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    setPlaying(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const track = chiptuneTracks[trackIndex];
    timerRef.current = setInterval(() => {
      playNote(track.notes[stepRef.current % track.notes.length], track.tempo * 0.9);
      stepRef.current += 1;
    }, track.tempo);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      audioCtxRef.current?.close().catch(() => undefined);
    },
    [],
  );

  // gently pulse the player once, shortly after the visitor enters the site
  useEffect(() => {
    if (!hasEntered || pulsedRef.current || reducedMotion) return undefined;
    pulsedRef.current = true;
    setPulse(true);
    const id = setTimeout(() => setPulse(false), 1400 * 3);
    return () => clearTimeout(id);
  }, [hasEntered, reducedMotion]);

  // if a track change happens mid-playback, restart the sequencer on the new track
  useEffect(() => {
    if (playing) startSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  const handleNext = () => {
    stepRef.current = 0;
    setTrackIndex((index) => (index + 1) % chiptuneTracks.length);
  };

  const track = chiptuneTracks[trackIndex];

  return (
    <div
      className={[styles.player, playing ? styles.playerPlaying : "", pulse ? styles.playerPulse : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <p className={styles.playerHead}>♪ NOW PLAYING ♪ [WINYUVAL]</p>
      <div className={styles.playerBody}>
        <div className={styles.playerTrackViewport}>
          <span className={styles.playerTrackText}>{track.name}</span>
        </div>
        <div className={styles.playerViz} aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} className={styles.playerVizBar} style={{ animationDelay: `${index * 0.05}s` }} />
          ))}
        </div>
        <div className={styles.playerControls}>
          <button
            type="button"
            onClick={() => (playing ? stopSequence() : startSequence())}
            aria-pressed={playing}
            title="play/pause"
          >
            <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
            <span className="sr-only">{playing ? "Pause chiptune" : "Play chiptune"}</span>
          </button>
          <button type="button" onClick={handleNext} title="next track">
            <span aria-hidden="true">⏭</span>
            <span className="sr-only">Next track</span>
          </button>
          <button type="button" onClick={stopSequence} title="stop">
            <span aria-hidden="true">■</span>
            <span className="sr-only">Stop</span>
          </button>
        </div>
      </div>
    </div>
  );
}
