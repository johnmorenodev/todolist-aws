import { TextInput, Button, Modal, Stack, useMantineTheme } from '@mantine/core';
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
  const theme = useMantineTheme();
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
    createAccountMutation.mutate(values, {
      onSuccess: () => {
        handleClose();
      },
    });
  }

  function handleClose() {
    form.reset();
    close();
  }

  return (
    <Modal 
      opened={opened} 
      onClose={handleClose} 
      title="Add Account"
      radius="md"
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput 
            label="Account Name" 
            placeholder="Enter account name"
            {...form.getInputProps('name')} 
            size="md"
          />
          <Button 
            type="submit" 
            loading={createAccountMutation.isPending}
            fullWidth
            size="md"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.blue[5]} 0%, ${theme.colors.blue[6]} 100%)`,
              transition: 'all 0.2s ease',
            }}
          >
            Create Account
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}

export default AddAccountForm