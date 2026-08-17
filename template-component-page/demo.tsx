"use client";

import React from "react";
import { SampleComponent } from "./sample-component";

export default function Demo() {
  return (
    <div className="flex min-h-[500px] w-full flex-col items-center justify-center gap-6 p-6">
      <SampleComponent
        title="Sample Component"
        description="Interactive preview example component."
      />
    </div>
  );
}
