"use client";

import { CookieIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Luigi from "@/public/luigi.svg";
import Telegram from "@/public/telegram.svg";
import Twitter from "@/public/x.svg";

export default function CookieConsent({ variant = "default", demo = false, onAcceptCallback = () => { }, onDeclineCallback = () => { } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [hide, setHide] = useState(false);

    const accept = () => {
        setIsOpen(false);
        document.cookie = "cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        setTimeout(() => {
            setHide(true);
        }, 700);
        onAcceptCallback();
    };

    const decline = () => {
        setIsOpen(false);
        setTimeout(() => {
            setHide(true);
        }, 700);
        onDeclineCallback();
    };

    useEffect(() => {
        try {
            setIsOpen(true);
            if (document.cookie.includes("cookieConsent=true")) {
                if (!demo) {
                    setIsOpen(false);
                    setTimeout(() => {
                        setHide(true);
                    }, 700);
                }
            }
        }
        catch (e) {
            // console.log("Error: ", e);
        }
    }, []);

    return (
            <div className={cn("fixed z-[200] bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 w-full sm:max-w-md duration-700", !isOpen ? "transition-[opacity,transform] translate-y-8 opacity-0" : "transition-[opacity,transform] translate-y-0 opacity-100", hide && "hidden")}>
                <div className="dark:bg-card bg-background rounded-md m-3 border border-border shadow-lg">
                    <div className="grid gap-2">
                        <div className="border-b border-border h-14 flex items-center justify-between p-4">
                            <div className="flex items-center gap-2">
                                <Luigi className="w-6 h-6" viewBox="0 0 168 120" />
                                <h1 className="text-lg font-medium">Follow 0xLuigi</h1>
                            </div>
                            <X className="cursor-pointer" onClick={decline} />
                        </div>
                        <div className="p-4">
                            <p className="text-sm font-normal text-start text-pretty">
                                Stay up to date with the latest calls and insights from <code>0xLuigi</code>.
                                <br />
                                <br />
                                <span className="text-xs">Make sure to follow him on X and Telegram.</span>
                                <br />
                            </p>
                        </div>
                        <div className="flex gap-2 p-4 py-5 border-t border-border dark:bg-background/20">
                            <Button className="w-full" onClick={() => {
                                accept();
                                window.open("https://x.com/berryaixbt", "_blank");
                            }}>
                                <div className="flex items-center gap-2">
                                    <Twitter className="w-6 h-6" viewBox="0 0 30 30"></Twitter>
                                    <span>Twitter</span>
                                </div>
                            </Button>
                            <Button className="w-full" onClick={() => {
                                accept();
                                window.open("https://t.me/strawberrydigest", "_blank");
                            }}>
                                <div className="flex items-center gap-2">
                                    <Telegram className="w-6 h-6" viewBox="0 0 50 50"></Telegram>
                                    <span>Telegram</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
}