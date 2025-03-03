import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { randomBytes } from "crypto";
import { PublicKey } from "@solana/web3.js";
import { Kinspace } from "../target/types/kinspace";
import { assert } from "chai";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata, printSupply, createV1, fetchMasterEditionFromSeeds, printV1, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, createGenericFile, generateSigner, percentAmount, publicKey } from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";
import wallet from "../wallet.json";

const umi = createUmi("https://api.devnet.solana.com").use(mplTokenMetadata());

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(irysUploader());
umi.use(signerIdentity(signer));

describe("kinspace", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();

  const program = anchor.workspace.Kinspace as Program<Kinspace>;

  const seed = new BN(randomBytes(8));

  const space_name = 'Kinspace';
  const space_description = "Laboris reprehenderit sit excepteur esse incididunt incididunt cillum.";
  const mint_symbol = "KNS";

  const space_name_long = space_name.repeat(50);

  const space_name_description_long = "Long Description"
  const space_description_long = space_description.repeat(10);

  const creator = anchor.web3.Keypair.generate();

  describe('space', async () => {
    it('should allow user to create a space', async () => {
      await airdrop(provider.connection, creator.publicKey);

      const [spacePublicKey] = await getSpaceAddress(creator, space_name, program.programId);

      await program.methods.createSpace(space_name, space_description).accountsPartial(
        {
          creator: creator.publicKey,
          spaceAccount: spacePublicKey,
        }
      ).signers([creator]).rpc();

      const spaceData = await program.account.spaceAccount.fetch(spacePublicKey);

      assert.strictEqual(spaceData.creator.toString(), creator.publicKey.toString());
      assert.strictEqual(spaceData.name.toString(), space_name);
      assert.strictEqual(spaceData.description.toString(), space_description);
    })

    it('should not allow to create space with name longer than 32 bytes', async () => {
      let failed = false;

      try {
        const [spacePublicKey] = await getSpaceAddress(creator, space_name_long, program.programId);

        await program.methods.createSpace(space_name_long, space_description).accountsPartial(
          {
            creator: creator.publicKey,
            spaceAccount: spacePublicKey,
          }
        ).signers([creator]).rpc();
      } catch (error) {
        assert.strictEqual(error.message, "Max seed length exceeded");
        failed = true;
      }

      assert.isTrue(failed);
    })

    it('should not allow to create space with description longer than 256 bytes', async () => {
      let failed = false;

      try {
        const [spacePublicKey] = await getSpaceAddress(creator, space_name_description_long, program.programId);

        await program.methods.createSpace(space_name_description_long, space_description_long).accountsPartial(
          {
            creator: creator.publicKey,
            spaceAccount: spacePublicKey,
          }
        ).signers([creator]).rpc();
      } catch ({ error }) {
        if (error?.errorMessage) {
          assert.strictEqual(error.errorMessage, "Cannot initialize space, description too long");
          failed = true;
        }
      }

      assert.isTrue(failed);
    })
  })

  describe('mint', async () => {
    let mint_account = new PublicKey('')

    it('should create and update mint membership in space account', async () => {
      const [spacePublicKey] = await getSpaceAddress(creator, space_name, program.programId);

      const imageUri = await uploadAsset();
      const mintAddress = await createNFT(space_name, mint_symbol, space_description, imageUri);
      const mintPublicKey = new PublicKey(mintAddress)

      console.log("\nAsset address: ", mintAddress);
      console.log("\nAsset public key : ", mintPublicKey);

      membership_mint = mintPublicKey

      try {
        await program.methods.mintMembership(mintPublicKey).accountsPartial(
          {
            creator: creator.publicKey,
            spaceAccount: spacePublicKey,
          }
        ).signers([creator]).rpc();

        const spaceData = await program.account.spaceAccount.fetch(spacePublicKey);

        assert.strictEqual(spaceData.membershipMint.toString(), mintPublicKey.toString());
      } catch (error) {
        console.log('error update mint membership', error)
      }
    })

    it('should print and verify membership token', async () => {
      const masterEdition = await fetchMasterEditionFromSeeds(umi, {
        mint: publicKey(mint_account),
      })

      console.log('masterEdition', masterEdition)

      const masterTokenAccountOwner = generateSigner(umi);
      const editionMint = generateSigner(umi)
      const editionTokenAccountOwner = publicKey(creator.publicKey)
      const a = await printV1(umi, {
        masterTokenAccountOwner,
        masterEditionMint: masterEdition.publicKey,
        editionMint,
        editionTokenAccountOwner,
        editionNumber: masterEdition.supply + BigInt(1),
        tokenStandard: TokenStandard.NonFungible,
      }).sendAndConfirm(umi)
      console.log('a', a)
    })
  })
});

async function airdrop(connection: any, address: any, amount = 1_000_000_000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}

async function getSpaceAddress(creator: any, name: string, programId: any) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("space"), creator.publicKey.toBuffer(), Buffer.from(name)],
    programId
  );
}

async function uploadAsset() {
  try {
    const image = await readFile("kins.png")
    const file = await createGenericFile(image, "kins.png", {
      contentType: "img/png",
    })
    const [imageUri] = await umi.uploader.upload([file])

    console.log('imageUri: ', imageUri)
    return imageUri;
  } catch (error) {
    console.log('error upload', error)
  }
}

async function createNFT(name: string, symbol: string, description: string, imageUri: string) {
  try {
    const uri = await umi.uploader.uploadJson({
      name,
      symbol: 'KNS',
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
      description,
    });

    const mint = generateSigner(umi);

    const tx = createV1(umi, {
      mint,
      name,
      symbol,
      uri,
      sellerFeeBasisPoints: percentAmount(2),
      printSupply: printSupply('Limited', [50]),
    })
    await tx.sendAndConfirm(umi);

    return mint.publicKey;
  } catch (error) {
    console.log('error create nft', error)
  }
}
