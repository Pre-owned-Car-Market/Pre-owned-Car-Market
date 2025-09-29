import { render, screen } from '@testing-library/react'
import App from './App'
import { test, expect } from 'vitest'

test('판매 등록 화면이 렌더링된다', () => {
  render(<App />)

  // H1 제목 확인
  expect(
    screen.getByRole('heading', { level: 1, name: /중고차 빠른 판매 등록/i })
  ).toBeInTheDocument()

  // 전송 버튼 존재 확인
  expect(
    screen.getByRole('button', { name: /전송하기/i })
  ).toBeInTheDocument()
})
