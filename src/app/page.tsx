"use client";

import Navbar from "@/components/Navbar";
import  { supabase }   from "@/lib/supabase";
import { useState, useEffect } from 'react';

export default function Home() {
  const fetchData = async () => {
    const { data, error } = await supabase.from("pos").select("*");
    if (error) console.error(error);
    else console.log(data);
  };

  return (
    

    <div>
      <h1 >Welcome to OrangeFlow</h1>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
