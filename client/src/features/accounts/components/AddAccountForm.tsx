import { TextInput, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react'
import { z } from 'zod';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useCreateAccount } from '../api/mutations';

interface Props {
  opened: boolean;
  open: () => void;
  close: () => void;
}

//zod type
const createAccountSchema = z.object({
  name: z.string().min(3),
});

export type CreateAccountRequest  = z.infer<typeof createAccountSchema>;

function AddAccountForm({ opened, open, close }: Props) {
  const createAccountMutation = useCreateAccount();
  const form = useForm<CreateAccountRequest>({
    initialValues: {
      name: '',
    },
    validate: zod4Resolver(createAccountSchema),
  });

  function onSubmit(values: CreateAccountRequest) {
    //validate form
    const validationResult = form.validate();
    if (validationResult.hasErrors) {
      return;
    }

    //submit form
    createAccountMutation.mutate(values);
  }

  function handleClose() {
    form.reset();
    close();
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Add Account">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput label="Account Name" {...form.getInputProps('name')} />
        <Button type="submit">Create</Button>
      </form>
    </Modal>
  )
}

export default AddAccountForm