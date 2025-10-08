import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";

export default function Home() {
  // Sample product data
  const sampleProducts = [
    {
      id: "1",
      name: "프리미엄 한우 등심",
      description: "최고급 한우 등심 1등급",
      price: 45000,
      imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=400",
      imageAlt: "한우 등심",
      isLowestPrice: true,
      badge: "신선",
    },
    {
      id: "2",
      name: "유기농 채소 세트",
      description: "농장 직송 신선한 채소",
      price: 18000,
      badge: "유기농",
    },
    {
      id: "3",
      name: "국내산 삼겹살",
      price: 12000,
      isLoading: true,
    },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="bg-bg-subtle border-b border-border">
        <div className="container mx-auto px-6 py-16 max-w-7xl">
          <h1 className="text-4xl font-bold text-text mb-4">
            SMEats Design System
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl">
            Next.js 15 + Tailwind CSS v4로 구현된 SMEats 디자인 시스템 컴포넌트를 확인하세요.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-7xl space-y-16">
        {/* Buttons Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-text mb-2">Buttons</h2>
            <p className="text-text-secondary">
              다양한 스타일과 크기의 버튼 컴포넌트
            </p>
          </div>

          <Card variant="bordered">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Variants */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-text-secondary">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-text-secondary">Sizes</h3>
                  <div className="flex items-center flex-wrap gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                {/* States */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-text-secondary">States</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button disabled>Disabled</Button>
                    <Button isLoading>Loading</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Inputs Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-text mb-2">Inputs</h2>
            <p className="text-text-secondary">
              레이블, 에러 메시지, 헬퍼 텍스트를 포함한 입력 필드
            </p>
          </div>

          <Card variant="bordered">
            <CardContent className="p-6">
              <div className="space-y-6 max-w-md">
                <Input
                  label="이메일"
                  type="email"
                  placeholder="example@smeats.com"
                  helperText="로그인에 사용할 이메일을 입력하세요"
                />
                <Input
                  label="비밀번호"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                <Input
                  label="전화번호"
                  type="tel"
                  placeholder="010-0000-0000"
                  error="올바른 전화번호 형식이 아닙니다"
                />
                <Input
                  label="비활성화된 입력"
                  disabled
                  placeholder="입력할 수 없습니다"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-text mb-2">Badges</h2>
            <p className="text-text-secondary">
              상태와 정보를 표시하는 뱃지 컴포넌트
            </p>
          </div>

          <Card variant="bordered">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-text-secondary">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="danger">Danger</Badge>
                    <Badge variant="info">Info</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-text-secondary">Sizes</h3>
                  <div className="flex items-center flex-wrap gap-3">
                    <Badge size="sm">Small</Badge>
                    <Badge size="md">Medium</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-text mb-2">Cards</h2>
            <p className="text-text-secondary">
              콘텐츠를 그룹화하는 카드 컴포넌트
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>기본 테두리 스타일</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  기본 카드는 얇은 테두리를 사용합니다.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  자세히 보기
                </Button>
              </CardFooter>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>그림자 효과 스타일</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  호버 시 그림자가 강조됩니다.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  자세히 보기
                </Button>
              </CardFooter>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Bordered Card</CardTitle>
                <CardDescription>강조된 테두리 스타일</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  두꺼운 테두리로 강조합니다.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  자세히 보기
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Product Cards Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-text mb-2">Product Cards</h2>
            <p className="text-text-secondary">
              상품 정보를 표시하는 전문 카드 컴포넌트
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLoading={product.isLoading}
              />
            ))}
          </div>
        </section>

        {/* Color Tokens Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-text mb-2">Design Tokens</h2>
            <p className="text-text-secondary">
              디자인 시스템의 색상 토큰 (라이트/다크 모드 자동 전환)
            </p>
          </div>

          <Card variant="bordered">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Brand Colors */}
                <div>
                  <h3 className="text-sm font-medium text-text mb-3">Brand Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="h-16 rounded-[var(--radius-md)] bg-primary" />
                      <p className="text-xs font-medium">Primary</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-[var(--radius-md)] bg-secondary" />
                      <p className="text-xs font-medium">Secondary</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-[var(--radius-md)] bg-success" />
                      <p className="text-xs font-medium">Success</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-[var(--radius-md)] bg-danger" />
                      <p className="text-xs font-medium">Danger</p>
                    </div>
                  </div>
                </div>

                {/* Neutral Scale */}
                <div>
                  <h3 className="text-sm font-medium text-text mb-3">Neutral Scale</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <div key={shade} className="space-y-2">
                        <div
                          className={`h-12 rounded-[var(--radius-sm)] bg-neutral-${shade}`}
                        />
                        <p className="text-xs text-center">{shade}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-bg-subtle mt-16">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <p className="text-sm text-text-secondary text-center">
            SMEats Design System v1.0 - Built with Next.js 15 & Tailwind CSS v4
          </p>
        </div>
      </footer>
    </div>
  );
}
