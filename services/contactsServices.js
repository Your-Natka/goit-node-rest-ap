import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const contactsPath = path.join("db", "contacts.json");
const writeFunc = async (contacts) => {
  return await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

export async function listContacts() {
  const readJsonResult = await fs.readFile(contactsPath);
  const contactObject = JSON.parse(readJsonResult);
  return contactObject;
}

export async function getContactById(contactId) {
  const contactsObjFind = await listContacts();
  const contactObj = contactsObjFind.find(
    (contact) => contact.id === contactId
  );
  return contactObj || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const contactObj = contacts.findIndex((contact) => contact.id === contactId);

  if (contactObj === -1) {
    return null;
  }

  const [newContacts] = contacts.splice(contactObj, 1);
  await writeFunc(contacts);
  return newContacts;
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    name: name,
    email: email,
    phone: phone,
    id: uuidv4(),
  };

  contacts.push(newContact);
  await writeFunc(contacts);
  return newContact;
}

export async function changeContact(id, name, email, phone) {
  const contacts = await listContacts();
  const index = contacts.findIndex((el) => el.id === id);
  if (index === -1) {
    return null;
  }
  const updatedContact = {
    id,
    name: name || contacts[index].name,
    email: email || contacts[index].email,
    phone: phone || contacts[index].phone,
  };

  contacts[index] = updatedContact;

  await writeFunc(contacts);
  return updatedContact;
}
