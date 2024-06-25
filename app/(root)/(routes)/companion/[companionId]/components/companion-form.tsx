'use client'

import { Category, Companion } from "@prisma/client"
import { Form, FormProvider, useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

interface CompanionFormProps{
    initialData: Companion | null;
    categories: Category[]
}

const formSchema = z.object ({
  name: z.string().min(1,{ message: "Name is required"}),  
  desc: z.string().min(1,{ message: "Description is required"}),  
  instructs: z.string().min(200,{ message: "Instructions are required to be 200 char atleast."}),  
  seed: z.string().min(200,{ message: "Seed are required to be 200 char atleast."}),  
  src: z.string().min(1,{ message: "Src is required."}),  
  categoryId: z.string().min(1,{ message: "category is required."}),  
})

export default function CompanionForm({initialData, categories}:CompanionFormProps ) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      desc: "",
      instructs: "",
      seed: "",
      src: "",
      categoryId: undefined,
    }
  });

  const isLoading = form.formState.isSubmitting;
  
  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    console.log(values)
  }
  return (
    <div className="h-full p-5">
      <FormProvider  {...form}>
        <form  onSubmit={form.handleSubmit(onSubmit)}>
          <div>
          <div>
            <h3 className="text-3xl">
              General Information
            </h3>
            <p className="text-muted-foreground text-md">
              Add general information about the companion.
            </p>
          </div>
          <Separator className="bg-primary/30 my-2" />
          </div>

          <FormField
          name="src"
          render = {({field}) => (
            <FormItem className="flex items-center">
              <FormControl>
                Image Upload Component
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </form>
      </FormProvider>
    </div>
  )
}
