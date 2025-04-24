"use client"

import { Separator } from "@radix-ui/react-separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { CustomSeparator } from "./custom-separator"


export function SeparatorExamples() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Separator Cơ bản</CardTitle>
          <CardDescription>Các kiểu separator cơ bản theo hướng ngang và dọc</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-2">Separator ngang</h3>
            <div className="space-y-4">
              <div>
                <p className="mb-2">Nội dung phía trên</p>
                <Separator />
                <p className="mt-2">Nội dung phía dưới</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Separator dọc</h3>
            <div className="flex h-20">
              <div>Nội dung trái</div>
              <Separator orientation="vertical" className="mx-4" />
              <div>Nội dung phải</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Separator với nhãn</CardTitle>
          <CardDescription>Separator có thể hiển thị nhãn ở các vị trí khác nhau</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-2">Nhãn ở giữa</h3>
            <CustomSeparator label="HOẶC" className="my-4" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Nhãn ở đầu</h3>
            <CustomSeparator label="MỤC" labelPosition="start" className="my-4" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Nhãn ở cuối</h3>
            <CustomSeparator label="KẾT THÚC" labelPosition="end" className="my-4" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Các biến thể Separator</CardTitle>
          <CardDescription>Các kiểu separator khác nhau: mặc định, đứt nét, chấm, và gradient</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-2">Mặc định</h3>
            <CustomSeparator variant="default" className="my-4" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Đứt nét</h3>
            <CustomSeparator variant="dashed" className="my-4" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Chấm</h3>
            <CustomSeparator variant="dotted" className="my-4" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Gradient</h3>
            <CustomSeparator variant="gradient" className="my-4" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Gradient với nhãn</h3>
            <CustomSeparator variant="gradient" label="NỔI BẬT" className="my-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

