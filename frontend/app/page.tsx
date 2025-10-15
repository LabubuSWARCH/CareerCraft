import { GridItem } from "@/components/grid-item";
import { Button } from "@/components/ui/button";
import { Palette, Cloud, Zap } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  return (
    <main className="container mx-auto px-8 gap-16 flex flex-col items-center py-8 md:py-16 lg:py-24 md:gap-20 lg:gap-24">
      <section className="flex flex-col items-center justify-center md:gap-8 text-left md:text-center max-w-4xl w-full gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Zap className="h-3 w-3" />
          <span>Build your resume in minutes</span>
        </div>
        <h1 className="mb-0  text-balance tracking-tighter font-bold text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]">
          Craft resumes that get you <span className="text-primary">hired</span>
        </h1>
        <p className="mt-0 mb-0 text-balance text-lg md:text-xl text-muted-foreground max-w-2xl ">
          Create professional resumes with our intuitive builder and
          expert-designed templates.
        </p>
        <div className="flex items-center gap-4 mt-4 flex-col md:flex-row w-full justify-center">
          <Button asChild size="lg" className="w-full md:w-auto">
            <Link href="/resumes">Create your resume</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full md:w-auto"
          >
            <Link href="/templates">View templates</Link>
          </Button>
        </div>
      </section>

      <section className="w-full">
        <div className="text-left md:text-center mb-12">
          <h2 className="font-bold mb-4 text-2xl md:text-3xl lg:text-4xl">
            Everything you need to stand out
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful features to help you create the perfect resume
          </p>
        </div>
        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-4 max-w-screen-lg mx-auto">
          <GridItem
            area="md:[grid-area:1/1/3/8]"
            icon={
              <Palette className="h-6 w-6 text-primary dark:text-primary" />
            }
            title="Beautiful Templates"
            description="Choose from a variety of professionally designed templates."
            image="https://placehold.co/800x600.png"
          />
          <GridItem
            area="md:[grid-area:1/8/2/13]"
            icon={<Zap className="h-4 w-4 text-primary dark:text-primary" />}
            title="Edit in Real-Time"
            description="See changes instantly as you build your resume."
          />
          <GridItem
            area="md:[grid-area:2/8/3/13]"
            icon={<Cloud className="h-4 w-4 text-primary dark:text-primary" />}
            title="Access Anywhere"
            description="Your resumes, synced across all your devices."
          />
        </ul>
      </section>

      <section className="text-center">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-12 md:p-16 border">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to craft your career?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have landed their dream jobs
            with CareerCraft resumes.
          </p>
          <Button asChild size="lg">
            <Link href="/resumes">Get started for free</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
