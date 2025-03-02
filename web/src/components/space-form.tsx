"use client";

import { AnchorError, AnchorProvider, Program, setProvider, Wallet, web3 } from "@coral-xyz/anchor"
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IDL_OBJECT, PROGRAM_ID } from "@/lib/state";
import { z } from "zod";
import { getSpaceAddress } from "@/lib/utils";
import { Button } from "./ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Kinspace } from "@/lib/kinspace";
import { toast } from "sonner"
import { useRouter } from "next/navigation";

const spaceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type SpaceSchema = z.infer<typeof spaceSchema>;

export default function SpaceForm() {
  const router = useRouter()
  const wallet = useWallet()
  const { connection } = useConnection()

  const form = useForm<SpaceSchema>({
    resolver: zodResolver(spaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const getProvider = () => {
    const provider = new AnchorProvider(connection, wallet as unknown as Wallet, AnchorProvider.defaultOptions())
    setProvider(provider)
    return provider
  }

  const onSubmit = async (values: SpaceSchema) => {
    const { name, description } = values;

    try {
      const anchorProvider = getProvider()
      const program = new Program<Kinspace>(IDL_OBJECT, anchorProvider)
      const creatorPubKey = anchorProvider.publicKey
      const [spacePubKey] = getSpaceAddress(name, creatorPubKey, PROGRAM_ID)

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
