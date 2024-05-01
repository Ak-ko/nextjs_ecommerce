import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
export default function ProductSkeleton() {
    return (
        <Card className="flex flex-col overflow-hidden">
            <Skeleton className="relative w-full h-auto aspect-video" />
            <CardHeader>
                <CardTitle>
                    <Skeleton className="w-[30%] h-[15px] rounded-full" />
                </CardTitle>
                <CardDescription>
                    <Skeleton className="w-[20%] h-[10px] rounded-full" />
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <Skeleton className="w-full h-[10px] rounded-full" />
                <Skeleton className="w-[80%] h-[10px] rounded-full" />
                <Skeleton className="w-[30%] h-[10px] rounded-full" />
            </CardContent>

            <CardFooter>
                <Skeleton className="w-full h-[40px]" />
            </CardFooter>
        </Card>
    );
}
