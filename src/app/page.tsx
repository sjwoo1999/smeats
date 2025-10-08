import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-bg border-b border-border">
        <div className="container mx-auto px-6 py-24 max-w-7xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-text">
              급식 식자재 B2B 마켓플레이스
              <span className="block text-primary mt-2">SMEats</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              배송 가능한 마트의 상품을 검색하고 최저가를 비교하세요.
              <br />
              레시피 기반 발주로 더욱 편리하게.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <Button size="lg" variant="primary">
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">스마트 상품 검색</h3>
              <p className="text-text-secondary">
                배송 가능한 마트의 상품을 실시간으로 검색하고 최저가를 자동으로 비교합니다.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
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
              </div>
              <h3 className="text-xl font-semibold">레시피 기반 발주</h3>
              <p className="text-text-secondary">
                레시피 템플릿을 선택하고 인원수를 입력하면 필요한 식자재를 자동으로 계산합니다.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">간편한 주문 관리</h3>
              <p className="text-text-secondary">
                장바구니에 담고 주문 내역을 확인하며, 배송 상태를 실시간으로 추적합니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-bg-subtle border-y border-border">
        <div className="container mx-auto px-6 py-20 max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">이용 방법</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-lg font-semibold">회원가입</h3>
              <p className="text-text-secondary text-sm">
                고객 또는 판매자로 가입하고 프로필을 작성합니다.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-lg font-semibold">상품 검색</h3>
              <p className="text-text-secondary text-sm">
                필요한 식자재를 검색하고 최저가를 비교합니다.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-lg font-semibold">장바구니 담기</h3>
              <p className="text-text-secondary text-sm">
                원하는 상품을 장바구니에 담고 수량을 조절합니다.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                4
              </div>
              <h3 className="text-lg font-semibold">주문 완료</h3>
              <p className="text-text-secondary text-sm">
                배송지를 입력하고 주문을 완료합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="bg-gradient-to-r from-primary to-primary-hover rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg mb-8 opacity-90">
            SMEats와 함께 더 쉽고 저렴하게 식자재를 구매하세요.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-bg-subtle">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-text">SMEats</h3>
              <p className="text-sm text-text-secondary">
                급식 식자재 B2B 마켓플레이스
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-text">서비스</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>
                  <Link href="/products" className="hover:text-primary">
                    상품 검색
                  </Link>
                </li>
                <li>
                  <Link href="/recipes" className="hover:text-primary">
                    레시피
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-primary">
                    주문 내역
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-text">고객 지원</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>
                  <a href="mailto:support@smeats.com" className="hover:text-primary">
                    문의하기
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    자주 묻는 질문
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    이용 가이드
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-text">회사</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>
                  <a href="#" className="hover:text-primary">
                    회사 소개
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    이용 약관
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    개인정보 처리방침
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-text-secondary">
            <p>&copy; 2025 SMEats. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
