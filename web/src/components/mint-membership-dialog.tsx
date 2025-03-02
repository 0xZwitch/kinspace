"use client";

import { Button, buttonVariants } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from '@solana/wallet-adapter-react';
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { createGenericFileFromBrowserFile, generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAnchorProvider } from './solana-provider';
import { getKinspaceProgram } from '@/lib/exports';
import { web3 } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import ImageUploader from './image-uploader';

interface FormData {
  name: string
  symbol: string
  description: string
  mint: string
}

// TODO: use proper form and submit handler
export default function MintMembershipDialog({ spaceAddress }: { spaceAddress: string }) {
  const wallet = useWallet();
  const provider = useAnchorProvider();
  const program = getKinspaceProgram(provider);
  const umi = createUmi('https://api.devnet.solana.com')
    .use(walletAdapterIdentity(wallet))
    .use(mplTokenMetadata())
    .use(irysUploader())

  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUri, setImageUri] = useState("")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    symbol: "",
    description: "",
    mint: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpload = async (file: File) => {
    try {
      const imageFile = await createGenericFileFromBrowserFile(file);
      const [imageUri] = await umi.uploader.upload([imageFile]);
      setImageUri(imageUri);
    } catch (error) {
      toast("Upload failed.")
      console.log('error uploading image', error)
    }
  }

  const mintMembership = async (mintAddress: string) => {
    try {
      const creator = provider.publicKey
      const spaceAccount = new PublicKey(spaceAddress)
      const mintPubKey = new PublicKey(mintAddress)

      await program.methods.mintMembership(mintPubKey).accountsPartial({
        creator,
        spaceAccount,
        systemProgram: web3.SystemProgram.programId,
      }).rpc()
    } catch (error) {
      console.log('error', error)
      toast("Mint failed.")
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      let mintAddress = formData.mint

      if (!formData.mint && (!formData.name || !formData.symbol || !formData.description || !imageUri)) {
        toast("Please fill the form")
        return
      }

      if (!mintAddress) {
        // TODO: separate upload metadata function
        const uri = await umi.uploader.uploadJson({
          name: formData.name,
          symbol: formData.symbol,
          image: imageUri,
          attributes: [],
          properties: {
            files: [
              {
                type: "image/png",
                uri: imageUri,
              },
            ]
          },
          description: formData.description,
        });

        // TODO: handle error creating nft but succeed uploading metadata
        const mint = generateSigner(umi);

        const tx = createNft(umi, {
          mint,
          name: formData.name,
          symbol: formData.symbol,
          uri,
          sellerFeeBasisPoints: percentAmount(2)
        })
        await tx.sendAndConfirm(umi);
        mintAddress = mint.publicKey
        toast("Mint success!", { description: `Mint Address: ${mintAddress}` })
        console.log("Mint Address: ", mintAddress);
      }

      await mintMembership(mintAddress)

      setFormData({
        name: "",
        symbol: "",
        description: "",
        mint: "",
      })
      toast("Space updated!")

      setOpen(false)
    } catch (error) {
      toast("Mint failed.")
      console.log('error mint', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: "default" })}>Mint Now</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-4'>Mint Membership</DialogTitle>

          <div className="space-y-2">
            <Label htmlFor="mint">Mint Address</Label>
            <Input id="mint" name="mint" value={formData.mint} onChange={handleChange} required
              disabled={formData.description !== "" || formData.name !== "" || formData.symbol !== ""} />
          </div>

          <div className="space-y-2">
            <div className="text-sm">Or</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required
              disabled={formData.mint !== ''} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              required
              disabled={formData.mint !== ''}
            />
          </div>

          <div className="space-y-2 mb-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              disabled={formData.mint !== ''}
            />
          </div>
          {(formData.name && formData.symbol && formData.description)
            ? <ImageUploader onUpload={handleUpload} /> : <></>}

          <div className="space-y-2 mt-2">
            <Button className="w-full" disabled={isSubmitting || (!imageUri && !formData.mint)} onClick={handleSubmit}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
          {(!formData.name || !formData.symbol || !formData.description || !formData.mint) ?
            <div className='text-sm text-destructive mt-2'>Please fill all the form</div> : <></>}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
