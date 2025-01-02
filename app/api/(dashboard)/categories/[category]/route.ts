import connect from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";


export const PATCH = async(req:Request,context:{params:any})=>{
    const categoryId = context.params.category;
    try{
        const body = await req.json();
        const {title} = body;
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get('userId');


    if(!userId || !Types.ObjectId.isValid(userId)){
        return new NextResponse('userId is required', {status:400});
    }

    if(!categoryId || !Types.ObjectId.isValid(categoryId)){
        return new NextResponse('categoryId is required', {status:400});
    }

    if(!title){
        return new NextResponse('title is required', {status:400});
    }

    await connect();

    const user = await User.findById(userId);

    if(!user){
        return new NextResponse('User not found in the database', {status:404});
    }

    const category = await Category.findOne({_id:categoryId, user:userId});
    if(!category){
        return new NextResponse('Category not found in the database', {status:404});
    }
    const updatedCategory = await Category.findByIdAndUpdate({
        _id:categoryId,
        user:userId
    },{
        title
    },{new:true});

    return new NextResponse(JSON.stringify(updatedCategory), {status:200});
    }
    catch(err:any){
        return new NextResponse(err.message, {status:500});
    }
}


export const DELETE = async(req:Request,context:{params:any})=>{
    const categoryId = context.params.category;
try{
    const {searchParams} = new URL(req.url);
    const userId = searchParams.get('userId');
    if(!userId || !Types.ObjectId.isValid(userId)){
        return new NextResponse('userId is required', {status:400});
    }

    if(!categoryId || !Types.ObjectId.isValid(categoryId)){
        return new NextResponse('categoryId is required', {status:400});
    }
await connect();

    const user = await User.findById(userId);
    
    if(!user){
        return new NextResponse('User not found in the database', {status:404});
    }

    const category = await Category.findOne({_id:categoryId, user:userId});
    if(!category){
        return new NextResponse('Category not found in the database', {status:404});
    }
    await Category.findByIdAndDelete(categoryId);
    return new NextResponse(JSON.stringify("category is successfully deleted!"), {status:200});


}catch(err:any){
    return new NextResponse(err.message, {status:500});
}
}