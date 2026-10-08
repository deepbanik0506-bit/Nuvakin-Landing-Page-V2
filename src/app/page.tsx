import { Hero } from "@/components/sections/Hero";
import { Building } from "@/components/sections/Building";
import { Intelligence } from "@/components/sections/Intelligence";
import { Platform } from "@/components/sections/Platform";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Evidence } from "@/components/sections/Evidence";
import { Vision } from "@/components/sections/Vision";
import { Waitlist } from "@/components/sections/Waitlist";

export default function Home() {
  return (
    <>
      <Hero />
      <Building />
      <Intelligence />
      <Platform />
      <Ecosystem />
      <Evidence />
      <Vision />
      <Waitlist />
    </>
  );
}
