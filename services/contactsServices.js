import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const contactsPath = path.join("db", "contacts.json");

export async function listContacts() {
  try {
    const result = await fs.readFile(contactsPath);
    return JSON.parse(result);
  } catch (error) {
    console.log(error);
  }
}
export async function getContactById(contactId) {
  const contacts = await listContacts();
  const res = contacts.find((contact) => contact.id === contactId);
  return res || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const res = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return res;
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    name,
    email,
    phone,
    id: uuidv4(),
  };

  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
}

export async function updateOneContact(id, body) {
  try {
    const contacts = await listContacts();

    const index = contacts.findIndex((contact) => contact.id === id);

    if (index === -1) {
      return null;
    }

    contacts[index] = { ...contacts[index], ...body };
    await fs.writeFile(contactsPath, JSON.stringify(contacts));

    return contacts[index];
  } catch (err) {
    console.log(err);
  }
}
