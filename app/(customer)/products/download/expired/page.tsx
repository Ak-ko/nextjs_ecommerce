import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Expire() {
    return (
        <div>
            <h1 className="text-3xl my-4">Download Link Expired</h1>
            <Button asChild>
                <Link href={"/orders"}>Get New Link</Link>
            </Button>
        </div>
    );
}
