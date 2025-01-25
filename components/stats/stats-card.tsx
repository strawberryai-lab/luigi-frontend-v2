"use client"
import * as React from "react"
import CountUp from 'react-countup'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StatsCardProps {
  title: string
  description: string
  children?: React.ReactNode
  value?: number
  className?: string
  icon?: React.ReactNode
}

export function StatsCard({ title, description, children, value, className, icon }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {value !== undefined ? (
          <h1 className="text-2xl">
            <CountUp
              end={value}
              duration={2}
              separator=","
              decimal="."
              decimals={0}
            />
          </h1>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
