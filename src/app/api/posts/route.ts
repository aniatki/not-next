import { addDoc, collection, getDocs, QuerySnapshot } from "firebase/firestore";
import { db } from "../../../../firebase/firebase.config";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const querySnapshot: QuerySnapshot = await getDocs(collection(db, "posts"));
    // @ts-ignore
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    // @ts-ignore
    return NextResponse.json(posts);

  } catch (error) {
    console.error("Error fetching documents: ", error);
    // Return an error response
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const { title, body } = await request.json();

    const docRef = await addDoc(collection(db, "posts"), {
      title: title,
      body: body,
    });
    
    console.log("Successfully added document with ID: ", docRef.id);

    // Return a success response
    return NextResponse.json({ id: docRef.id, message: "Post created successfully" }, { status: 201 });

  } catch (e) {
    console.error("Error adding document: ", e);
    // Return an error response
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}