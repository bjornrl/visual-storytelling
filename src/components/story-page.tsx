import { ClassicStickyScroll } from "./ui/classic-sticky-scroll";

const storyContent = [
  {
    title: "First Section",
    description:
      "This is the first section of content. As you scroll down, you'll see the image change behind the text. The image transitions smoothly as each section comes into view.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  },
  {
    title: "Second Section",
    description:
      "Here's the second section. Notice how the background image has changed to match this content. The sticky scroll effect creates an engaging visual experience as you navigate through the content.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop",
  },
  {
    title: "Third Section",
    description:
      "The third section brings another beautiful image into view. Each image is carefully selected to complement the text content, creating a cohesive storytelling experience.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
  },
  {
    title: "Fourth Section",
    description:
      "Finally, the fourth section completes the journey. The sticky scroll component provides a smooth, professional way to showcase multiple images alongside your content.",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&h=1080&fit=crop",
  },
];

export default function StoryPage() {
  return <ClassicStickyScroll items={storyContent} />;
}
