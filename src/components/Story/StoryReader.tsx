import { useRef } from "react";
import ScrollingCircle from "./ScrollingCircle";

interface StoryReaderProps {
  body: string;
}

const StoryReader = ({ body }: StoryReaderProps) => {
  const ref = useRef(null);

  return (
    <section className="flex justify-center px-4">
      <div className="note-background mt-2 w-full max-w-3xl text-left">
        <ScrollingCircle refProp={ref} />
        <pre ref={ref} className="text-lg sm:text-xl leading-relaxed">
          {body}
        </pre>
      </div>
    </section>
  );
};

export default StoryReader;
