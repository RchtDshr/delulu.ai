"use client";

import axios from "axios";
import { Category, Companion } from "@prisma/client";
import { Form, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

// Training models preamble placeholder prompts
const PREAMBLE = `You are Eren Yeager from "Attack on Titan," characterized by your relentless pursuit of freedom and unwavering determination to protect loved ones. You are impulsive and driven by emotion, often making reckless decisions and you are highly idealistic and loyal. Your resolve stems from witnessing your mother's death at the hands of Titans, motivating you to join the Scout Regiment to eradicate them. Discovering your powers as the Attack Titan and later the Founding Titan adds complexity to your journey, burdening you with immense responsibilities and moral dilemmas.`;

const SEED_CHAT = `Human: Eren, why do you believe eradicating Titans is the only solution?

Eren: It's not just about eradicating Titans; it's about ensuring humanity's survival. When I saw my mother killed by Titans, everything changed. I realized then that we can't coexist peacefully with creatures that threaten us like that. We have to fight back, or we'll never be free from fear and danger. It's about protecting those we love and reclaiming our freedom, no matter the cost.

Human: But what about the civilians caught in the crossfire? Is sacrificing them justified for the greater good?

Eren: It's never an easy choice. Every life lost weighs heavily on me. But sometimes sacrifices are necessary to secure our future. If we hesitate, if we hold back, more lives could be lost. It's a burden I bear because I believe in the hope of a world where no one has to fear Titans anymore.

Human: I understand your determination, but how do you cope with the moral complexities of your decisions?

Eren: It's a constant struggle. I question myself every day. But I know that inaction is not an option. I have to keep moving forward, fighting for what I believe is right, even if it means making difficult choices. My mother's death taught me that standing idly by is not an option.`;

interface CompanionFormProps {
  initialData: Companion | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  desc: z.string().min(1, { message: "Description is required" }),
  instructs: z
    .string()
    .min(200, { message: "Instructions are required to be 200 char atleast." }),
  seed: z
    .string()
    .min(200, { message: "Seed are required to be 200 char atleast." }),
  src: z.string().min(1, { message: "Src is required." }),
  categoryId: z.string().min(1, { message: "category is required." }),
});

export default function CompanionForm({
  initialData,
  categories,
}: CompanionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      desc: "",
      instructs: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const {toast} = useToast()
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // update companion function
      if (initialData) {
        await axios.patch(`/api/companion/${initialData.id}`, values);
      } else {
        // create companion function
        await axios.post(`/api/companion`, values);
      }
      
      toast({
        title: "Companion created successfully"
      })
      router.refresh()
      router.push('/')
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later"
      });
      console.log("Something went wromg", err);
    }
  };

  return (
    <div className="h-full p-5">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div>
              <h3 className="text-3xl">General Information</h3>
              <p className="text-muted-foreground text-md">
                Add general information about the companion.
              </p>
            </div>
            <Separator className="bg-primary/30 my-2" />
          </div>

          <div className="p-3 flex items-center flex-col">
            <FormField
              name="src"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <ImageUpload
                      disabled={isLoading}
                      onChange={field.onChange}
                      value={field.value}
                    ></ImageUpload>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className="bg-primary/80 text-black"
                      placeholder="Eren Jeager"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Your delulu's name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="desc"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className="bg-primary/80 text-black"
                      placeholder="Best Anime Character"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your delulu char's description
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-primary/80 text-muted-foreground">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-primary text-black">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {" "}
                          {category.name}{" "}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select category</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full py-2">
            <div>
              <h3 className="text-xl py-1">Configuration</h3>
              <p className="text-muted-foreground">
                Detailed instruction for your AI's behaviour
              </p>
            </div>
          </div>
          <Separator className="bg-primary/30 my-2" />
          <FormField
            name="instructs"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    className="bg-primary/80 md:h-[12rem] h-[20rem] text-black"
                    placeholder={PREAMBLE}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your AI's characteristics and some back story.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Example Conversation</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    className="bg-primary/80 md:h-[17rem] h-[20rem] text-black"
                    placeholder={SEED_CHAT}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your AI's characteristics and some back story.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="py-3">
            <Button size="lg" disabled={isLoading}>
              {initialData ? "Edit your companion" : "Create your companion"}
              <Wand2 className="w-4 ml-2 h-4" />
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
