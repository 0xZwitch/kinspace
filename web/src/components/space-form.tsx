"use client";

import { AnchorError, web3 } from "@coral-xyz/anchor"
import { useWallet } from "@solana/wallet-adapter-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getSpaceAddress } from "@/lib/utils";
import { Button } from "./ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { useAnchorProvider } from "./solana-provider";
import { getKinspaceProgram, KINSPACE_PROGRAM_ID } from "@/lib/exports";

const spaceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type SpaceSchema = z.infer<typeof spaceSchema>;

export default function SpaceForm() {
  const router = useRouter();
  const wallet = useWallet();
  const provider = useAnchorProvider();
  const program = getKinspaceProgram(provider);

  const form = useForm<SpaceSchema>({
    resolver: zodResolver(spaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: SpaceSchema) => {
    const { name, description } = values;

    try {
      const creatorPubKey = provider.publicKey
      const [spacePubKey] = getSpaceAddress(name, creatorPubKey, KINSPACE_PROGRAM_ID)

      await program.methods.createSpace(name, description).accountsPartial({
        creator: creatorPubKey,
        spaceAccount: spacePubKey,
        systemProgram: web3.SystemProgram.programId,
      }).rpc()

      console.log("submitted")
      form.reset()
      toast("Space has been created")
      router.back()
    } catch (error) {
      let errorMessage = error

      if (error instanceof AnchorError) {
        errorMessage = error.error.errorMessage
      }

      console.error("Error while creating space: " + errorMessage)
      toast("Error when creating Space", {
        description: errorMessage as string,
      })
    }
  }
  return (
    <div className="p-8">
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={8} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit" disabled={!wallet.connected}>{wallet?.connected ? "Submit" : "Connect a wallet"}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
