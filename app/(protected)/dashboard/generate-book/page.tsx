"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { createBook } from "@/actions/book";
import { toast } from "sonner";

export default function GenerateBookPage() {
  const [numPages, setNumPages] = useState(5);
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const router = useRouter();

  const handlePageChange = (value: number[]) => {
    setNumPages(value[0]);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (prompt.trim().length < 10) {
      toast.error(
        "Please enter a more detailed story prompt (at least 10 characters)"
      );
      return;
    }

    setIsLoading(true);
    setGenerationProgress(0);

    try {
      // Show generation steps
      setGenerationStep("Analyzing your story prompt...");
      setGenerationProgress(10);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setGenerationStep("Creating story outline...");
      setGenerationProgress(30);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setGenerationStep("Generating story content with AI...");
      setGenerationProgress(60);

      const result = await createBook({
        prompt: prompt.trim(),
        numPages,
        title: title.trim() || undefined,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to create story");
        return;
      }

      setGenerationStep("Finalizing your storybook...");
      setGenerationProgress(90);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setGenerationProgress(100);

      // Success - show toast and navigate to stories page
      toast.success("Your story has been created successfully!");

      // Small delay before redirecting
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/dashboard/my-stories");
    } catch (error) {
      console.error("Error generating book:", error);
      toast.error("There was an error generating your book. Please try again.");
    } finally {
      setIsLoading(false);
      setGenerationStep(null);
      setGenerationProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generate a New Story
        </h1>
        <p className="text-gray-600">
          Create a personalized children's story by providing a prompt and
          selecting the number of pages.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Story Title (optional)
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter a title for your story"
              value={title}
              onChange={handleTitleChange}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="mt-2 text-xs text-gray-500">
              If you leave this blank, we'll generate a title for you
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Pages:{" "}
              <span className="font-bold text-purple-600">{numPages}</span>
            </label>
            <Slider
              defaultValue={[5]}
              min={1}
              max={10}
              step={1}
              onValueChange={handlePageChange}
              disabled={isLoading}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 page</span>
              <span>5 pages</span>
              <span>10 pages</span>
            </div>
          </div>

          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Story Prompt
            </label>
            <Textarea
              id="prompt"
              placeholder="Describe your story idea here... For example: A friendly dragon who learns to bake cookies and shares them with woodland creatures."
              value={prompt}
              onChange={handlePromptChange}
              disabled={isLoading}
              rows={6}
              className="resize-none"
            />
            <p className="mt-2 text-sm text-gray-500">
              Be descriptive! The more details you provide, the better your
              story will be.
            </p>
          </div>

          {isLoading && generationStep && (
            <div className="bg-purple-50 p-4 rounded-md space-y-3">
              <div className="flex items-center space-x-2">
                {generationProgress === 100 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                )}
                <span
                  className={`${
                    generationProgress === 100
                      ? "text-green-700"
                      : "text-purple-700"
                  } font-medium`}
                >
                  {generationStep}
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2.5">
                <div
                  className={`${
                    generationProgress === 100
                      ? "bg-green-600"
                      : "bg-purple-600"
                  } h-2.5 rounded-full transition-all duration-300 ease-in-out`}
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              {generationProgress >= 60 && (
                <div className="flex items-center text-purple-700 text-sm">
                  <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                  <span>Our AI is creating a unique story just for you!</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2"
                size="lg"
                disabled={isLoading || prompt.trim().length < 10}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4" />
                    Create Story
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                size="lg"
                onClick={() => {
                  setNumPages(5);
                  setPrompt("");
                  setTitle("");
                }}
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <h3 className="font-medium text-purple-800 mb-2">
            Story Creation Tips
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-purple-700">
            <li>Include main characters with clear personalities</li>
            <li>Mention a setting (forest, castle, space station, etc.)</li>
            <li>Describe a problem that needs to be solved</li>
            <li>Consider adding a moral or lesson to the story</li>
            <li>
              Age-appropriate themes help create better children's stories
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
}
