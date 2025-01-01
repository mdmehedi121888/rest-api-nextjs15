import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server"

export const GET = async() =>{
    try{
        await connect();
        const users = await User.find({});
        return new NextResponse(JSON.stringify(users), {status: 200});
    }
    catch(e:any)
    {
        return new NextResponse(JSON.stringify({message: e.message}), {status: 500});
    }
}

export const POST = async(req:Request) =>{
    try{
        await connect();
        const body = await req.json();
        const user = new User(body);
        await user.save();
        return new NextResponse(JSON.stringify(user), {status: 201});
    }
    catch(e:any)
    {
        return new NextResponse(JSON.stringify({message: e.message}), {status: 500});
    }
}

export const PATCH = async(req:Request) =>{
    try{
        const body = await req.json();
        const {userId,username} = body;
        await connect();
        if(!userId || !username)
        {
            return new NextResponse(JSON.stringify({message: "Invalid request body"}), {status: 400});
        }
        if(!Types.ObjectId.isValid(userId))
        {
            return new NextResponse(JSON.stringify({message: "Invalid user id"}), {status: 400});
        }
        const updateUser = await User.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {username:username},
            {new:true}
        )
        if(!updateUser)
        {
            return new NextResponse(JSON.stringify({message: "User not found"}), {status: 404});
        }
        return new NextResponse(JSON.stringify(updateUser), {status: 200});
        
    }
    catch(e:any)
    {
        return new NextResponse(JSON.stringify({message: e.message}), {status: 500});
    }
}

export const DELETE = async(req:Request) =>{
    try{
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get("userId");
        await connect();
        if(!userId)
        {
            return new NextResponse(JSON.stringify({message: "Invalid request body"}), {status: 400});
        }
        if(!Types.ObjectId.isValid(userId))
        {
            return new NextResponse(JSON.stringify({message: "Invalid user id"}), {status: 400});
        }
        const deleteUser = await User.findOneAndDelete({_id: new ObjectId(userId)});
        if(!deleteUser)
        {
            return new NextResponse(JSON.stringify({message: "User not found"}), {status: 404});
        }
        return new NextResponse(JSON.stringify(deleteUser), {status: 200});

    }
    catch(e:any)
    {
        return new NextResponse(JSON.stringify({message: e.message}), {status: 500});
    }
}
