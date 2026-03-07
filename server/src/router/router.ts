import { IssueCommentsSchema, IssueSchema, UserSchema } from "@magadhtech/mds-schema";
import { desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import z from "zod";
import { db } from "../db/db";
import { PrettierErorr } from "../helper";
import { authenticate, getAuthSession } from "../middleware/auth.middleware";
import { issueComments } from "../schema/schema";




export const router=new Hono()


const CreateIssueSchema =z.object({
  
  title:z.string().min(1,"Title is required"),
  description:z.string().optional(),
  priority_level:z.enum(["low","medium","high"]).default("low"),
  attachments:z.array(z.string()).optional(),
})
const EditIssueSchema =z.object({
  
  title:z.string().optional(),
  description:z.string().optional(),
  priority_level:z.enum(["low","medium","high"]).optional(),
  status:z.enum(["open","in_progress","closed"]).optional(),
  attachments:z.array(z.string()).optional(),   
})

router.use("*",authenticate)
router.post('/issues', async (c) => {
  const body = await c.req.json()
  const authUser=getAuthSession(c)
  const parsedBody = CreateIssueSchema.safeParse(body)
  if (!parsedBody.success) {

    return c.json({ error: PrettierErorr(parsedBody.error) }, 400)
  } 
    const {title,description,priority_level,attachments}=parsedBody.data

  await db.insert(IssueSchema).values({
    description:description,
    title:title,
    priority:priority_level,
    attachments,
    createdBy:authUser.user.id,
  })

  return c.json({ message: 'Issue created successfully' }, 201)

})


router.put('/issues/:id', async (c) => {
  const body = await c.req.json()
  const parsedBody = EditIssueSchema.safeParse(body)
  if (!parsedBody.success) {

    return c.json({ error: PrettierErorr(parsedBody.error) }, 400)
  } 
    const {title,description,priority_level,status,attachments}=parsedBody.data
  const { id } = c.req.param()
  if(!id){
    return c.json({ error: 'Issue id is required' }, 400)
  }


  await db.update(IssueSchema).set({
    description:description,
    title:title,
    priority:priority_level,
    status,
    attachments,
    closedAt:status==="closed"?new Date():null
  }).where(eq(IssueSchema.id,id))



  return c.json({ message: 'Issue updated successfully' }, 200)
})





router.get('/issues', async (c) => {

  const data=await db.select({
    id:IssueSchema.id,
    title:IssueSchema.title,
    description:IssueSchema.description,
    priority:IssueSchema.priority,
    status:IssueSchema.status,
    attachments:IssueSchema.attachments,
    createdAt:IssueSchema.createdAt,
    closedAt:IssueSchema.closedAt,
    createdBy:IssueSchema.createdBy,

    comments:{
      id:IssueCommentsSchema.id,
      comment:IssueCommentsSchema.comment,
      commentType:IssueCommentsSchema.commentType,
      attachments:IssueCommentsSchema.attachments,
      createdAt:IssueCommentsSchema.createdAt,
      user:sql
      
      `json_build_object(
    
        'id', user.id,
        'name', user.name,
        'email', user.email,
        'role', user.role

      
      )
        join ${UserSchema} on ${UserSchema.id}=${IssueCommentsSchema.userId} as user
        where ${issueComments.userId}=${UserSchema.id}

        
      `,
      metadata:IssueCommentsSchema.metadata,
    
    }


  }).from(IssueSchema)
.orderBy(desc(IssueSchema.createdAt))

  

return c.json({
  data,
  message:"success",
},200)

})






