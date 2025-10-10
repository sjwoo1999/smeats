"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  // Mock user data
  const users = [
    {
      id: "1",
      name: "김영양",
      email: "kim@school.edu",
      role: "buyer",
      organization: "서울 ○○초등학교",
      status: "active",
      created_at: "2024-12-15",
    },
    {
      id: "2",
      name: "이판매",
      email: "lee@market.com",
      role: "seller",
      organization: "신선마트",
      status: "active",
      created_at: "2024-12-10",
    },
    {
      id: "3",
      name: "박급식",
      email: "park@school.edu",
      role: "buyer",
      organization: "부산 △△중학교",
      status: "active",
      created_at: "2024-12-20",
    },
    {
      id: "4",
      name: "최영양",
      email: "choi@school.edu",
      role: "buyer",
      organization: "인천 □□고등학교",
      status: "pending",
      created_at: "2025-01-05",
    },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "buyer":
        return <Badge variant="info">구매자</Badge>;
      case "seller":
        return <Badge variant="success">판매자</Badge>;
      case "admin":
        return <Badge variant="default">관리자</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">활성</Badge>;
      case "pending":
        return <Badge variant="warning">승인 대기</Badge>;
      case "suspended":
        return <Badge variant="danger">정지</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">사용자 관리</h1>
          <p className="mt-2 text-text-secondary">
            플랫폼 사용자를 관리하고 승인할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-text-secondary">전체 사용자</p>
            <p className="text-2xl font-bold text-text mt-1">145명</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-text-secondary">구매자</p>
            <p className="text-2xl font-bold text-info mt-1">89명</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-text-secondary">판매자</p>
            <p className="text-2xl font-bold text-success mt-1">52명</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-text-secondary">승인 대기</p>
            <p className="text-2xl font-bold text-warning mt-1">4명</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button className="px-4 py-2 border-b-2 border-primary text-primary font-semibold">
          전체 ({users.length})
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text transition-colors">
          구매자 ({users.filter(u => u.role === "buyer").length})
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text transition-colors">
          판매자 ({users.filter(u => u.role === "seller").length})
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text transition-colors">
          승인 대기 ({users.filter(u => u.status === "pending").length})
        </button>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-subtle border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    사용자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    역할
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    가입일
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-bg-subtle transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-text">{user.name}</p>
                        <p className="text-sm text-text-secondary">{user.organization}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text">{user.email}</td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4 text-text-muted text-sm">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === "pending" && (
                          <button className="px-3 py-1 text-sm bg-success text-white rounded hover:bg-success/90 transition-colors">
                            승인 (데모)
                          </button>
                        )}
                        <button className="px-3 py-1 text-sm border border-border rounded hover:bg-bg-subtle transition-colors">
                          상세
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
