import connect from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async(req:Request)=>{
    try{
        const {searchParams} = new URL(req.url);
    const userId = searchParams.get('userId');

    if(!userId || !Types.ObjectId.isValid(userId)){
        return new NextResponse('userId is required', {status:400});
    }

    await connect();

    const user = await User.findById(userId);
    if(!user){
        return new NextResponse('User not found in the database', {status:404});
    }
    const categories = await Category.find({user:new Types.ObjectId(userId)});

    return new NextResponse(JSON.stringify(categories), {status:200});
    }
    catch(err:any){
        return new NextResponse(err.message, {status:500});
    }
}

export const POST = async(req:Request)=>{
    try{
        const {searchParams} = new URL(req.url);
    const userId = searchParams.get('userId');

    if(!userId || !Types.ObjectId.isValid(userId)){
        return new NextResponse('userId is required', {status:400});
    }

    const {title} = await req.json();
    if(!title){
        return new NextResponse('title is required', {status:400});
    }

    await connect();

    const user = await User.findById(userId);
    if(!user){
        return new NextResponse('User not found in the database', {status:404});
    }

    const category = new Category({title, user: new Types.ObjectId(userId)});
    await category.save();

    return new NextResponse(JSON.stringify(category), {status:201});
    }
    catch(err:any){
        return new NextResponse(err.message, {status:500});
    }
}