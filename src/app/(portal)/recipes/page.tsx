import Link from "next/link";
import { browseRecipes } from "@/server/actions/recipes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function RecipesPage() {
  const result = await browseRecipes();

  if (!result.success) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-text">레시피 기반 발주</h1>
        <Card className="p-8 text-center">
          <p className="text-danger">{result.error}</p>
        </Card>
      </div>
    );
  }

  const recipes = result.data;

  if (recipes.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text">레시피 기반 발주</h1>
          <p className="mt-2 text-text-secondary">
            등록된 레시피가 없습니다.
          </p>
        </div>

        <Card className="p-12 text-center">
          <div className="space-y-4">
            <svg
              className="mx-auto h-16 w-16 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-text">
                레시피를 준비중입니다
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                곧 다양한 레시피 템플릿이 제공될 예정입니다.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">레시피 기반 발주</h1>
        <p className="mt-2 text-text-secondary">
          레시피 템플릿으로 필요한 식자재를 한 번에 주문하세요.
        </p>
      </div>

      {/* Info Banner */}
      <Card className="bg-info-bg border-info/20">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <svg
              className="h-6 w-6 text-info flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-info">
                레시피 기반 발주 방법
              </p>
              <p className="text-sm text-info/80 mt-1">
                1. 원하는 레시피 선택 → 2. 인분 수 입력 → 3. 자동 계산된 재료 확인 → 4. 장바구니 담기
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
            <Card
              variant="elevated"
              className="group overflow-hidden cursor-pointer transition-all hover:shadow-lg"
            >
            {/* Recipe Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
              {recipe.image_path ? (
                <Image
                  src={recipe.image_path}
                  alt={recipe.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                  <svg
                    className="h-16 w-16 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <Badge variant="default" className="shadow-sm bg-bg/90 backdrop-blur-sm">
                  {recipe.category}
                </Badge>
              </div>
            </div>

            {/* Recipe Info */}
            <CardHeader>
              <CardTitle className="line-clamp-1">{recipe.name}</CardTitle>
              {recipe.description && (
                <p className="text-sm text-text-secondary line-clamp-2 mt-2">
                  {recipe.description}
                </p>
              )}
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {/* Ingredients Count */}
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>재료 {recipe.items.length}가지</span>
                </div>

                {/* Action Button */}
                <Button variant="outline" className="w-full">
                  레시피 보기
                </Button>
              </div>
            </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
