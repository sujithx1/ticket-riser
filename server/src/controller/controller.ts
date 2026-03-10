import { RoleSchema, UserSchema } from "@magadhtech/mds-schema"
import { eq, or } from "drizzle-orm"
import { Context } from "hono"
import { db } from "../db/db"




export const getDevelopers=async(c:Context)=>{




  const data = await  db.select({
    name:UserSchema.name,
    role:{
      name:RoleSchema.name,
      id:RoleSchema.id
    },
    id:UserSchema.id,

  }).from(UserSchema)
  .leftJoin(RoleSchema,eq(RoleSchema.id,UserSchema.role))
  .where(or(eq(RoleSchema.name,"DEVELOPER"),eq(RoleSchema.name,"ADMIN")))
  

  return c.json({data,message:"success"},200)






}