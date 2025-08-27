import z from "zod";
import { FastifyTypeInstance } from "./types";
import { randomUUID } from "node:crypto";

interface User {
   id: string;
   name: string;
   email: string;
}

const users: User[] = []

export async function routes(app: FastifyTypeInstance) {
   app.get('/users', {
      schema: {
         tags: ['Users'],
         description: 'List Users',
         response: {
            200: z.array(z.object({
               id: z.string(),
               name: z.string(),
               email: z.string(),
            }))
         }
      }
   }, () => {
      return users;
   });

   app.post('/users', {
      schema: {
         tags: ['Users'],
         description: 'Create a new User',
         body: z.object({
            name: z.string(),
            email: z.string().email(),
         }),
         response: {
            201: z.null().describe('Success - User created successfully'),
         }
      }
   }, async (request, reply) => {
      const { name, email } = request.body

      users.push({
         id: randomUUID(),
         name,
         email
      })

      return reply.status(201).send();
   })
}
