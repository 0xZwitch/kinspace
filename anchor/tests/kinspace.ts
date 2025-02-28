import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { randomBytes } from "crypto";
import { PublicKey } from "@solana/web3.js";
import { Kinspace } from "../target/types/kinspace";
import { assert } from "chai";

describe("kinspace", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();

  const program = anchor.workspace.Kinspace as Program<Kinspace>;

  const seed = new BN(randomBytes(8));

  const space_name = 'Kinspace';
  const space_description = "Laboris reprehenderit sit excepteur esse incididunt incididunt cillum.";

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
        assert.strictEqual(error.errorMessage, "Cannot initialize space, description too long");
        failed = true;
      }

      assert.isTrue(failed);
    })
  })

  // describe('Space', async () => { 
  // it('should first', async () => { 

  //  })

  //  })
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
