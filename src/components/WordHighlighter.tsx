import React from 'react';
import { cn } from '../lib/utils';

interface WordHighlighterProps {
  text: string;
  className?: string;
  wordClassName?: string;
}

export const WordHighlighter = ({ text, className, wordClassName }: WordHighlighterProps) => {
  return (
    <span className={cn("cursor-default", className)}>
      {text.split(" ").map((word, i) => (
        <span key={i} className={cn("hover-outline mr-1", wordClassName)}>
          {word}
        </span>
      ))}
    </span>
  );
};
