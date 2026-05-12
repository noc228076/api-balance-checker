/**
 * 多平台 API 余额查询适配器
 */

const PROVIDERS = {
  openai: {
    name: 'OpenAI (ChatGPT)',
    color: '#10a37f',
    icon: '🤖',
    baseUrl: 'https://api.openai.com',
    async queryBalance(apiKey, baseUrl) {
      const url = baseUrl || this.baseUrl
      const headers = { Authorization: `Bearer ${apiKey}` }

      let lastError = null

      // 尝试 1: 新版订阅接口
      try {
        console.log('[OpenAI] 尝试查询订阅信息...')
        const subRes = await fetch(`${url}/v1/dashboard/billing/subscription`, { headers })
        console.log('[OpenAI] v1/dashboard/billing/subscription 响应状态:', subRes.status)
        
        if (subRes.ok) {
          const sub = await subRes.json()
          console.log('[OpenAI] 订阅信息:', JSON.stringify(sub, null, 2))
          
          const totalGranted = sub.hard_limit_usd || 0
          
          // 查询使用情况
          console.log('[OpenAI] 尝试查询使用情况...')
          const usageRes = await fetch(`${url}/v1/dashboard/billing/usage`, { headers })
          console.log('[OpenAI] v1/dashboard/billing/usage 响应状态:', usageRes.status)
          
          if (usageRes.ok) {
            const usage = await usageRes.json()
            console.log('[OpenAI] 使用情况:', JSON.stringify(usage, null, 2))
            
            const totalUsed = (usage.total_usage || 0) / 100
            const remaining = totalGranted - totalUsed
            
            return {
              total: totalGranted,
              used: totalUsed,
              remaining: Math.max(0, remaining),
              currency: 'USD',
              expiresAt: sub.access_until ? new Date(sub.access_until * 1000).toLocaleDateString() : null,
              detail: {
                hard_limit: sub.hard_limit_usd,
                soft_limit: sub.soft_limit_usd,
                access_until: sub.access_until
              }
            }
          } else {
            const errorText = await usageRes.text()
            console.log('[OpenAI] 使用情况查询失败:', errorText)
          }
        } else {
          const errorText = await subRes.text()
          console.log('[OpenAI] 订阅信息查询失败:', errorText)
          lastError = new Error(`API 返回错误 (${subRes.status}): ${errorText}`)
        }
      } catch (e) {
        console.error('[OpenAI] 订阅接口请求失败:', e.message)
        lastError = e
      }

      // 尝试 2: 旧版余额接口
      try {
        console.log('[OpenAI] 尝试旧版余额接口...')
        const balanceRes = await fetch(`${url}/dashboard/billing/credit_grants`, { headers })
        console.log('[OpenAI] dashboard/billing/credit_grants 响应状态:', balanceRes.status)
        
        if (balanceRes.ok) {
          const data = await balanceRes.json()
          console.log('[OpenAI] dashboard/billing/credit_grants 响应数据:', JSON.stringify(data, null, 2))
          
          if (data.total_available !== undefined) {
            return {
              total: data.total_granted || data.total_available,
              used: data.total_used || 0,
              remaining: data.total_available,
              currency: 'USD',
              expiresAt: null
            }
          }
        } else {
          const errorText = await balanceRes.text()
          console.log('[OpenAI] dashboard/billing/credit_grants 错误响应:', errorText)
        }
      } catch (e) {
        console.error('[OpenAI] 旧版余额接口请求失败:', e.message)
      }

      // 最后尝试 OneAPI 兼容接口
      console.log('[OpenAI] 尝试 OneAPI 兼容接口...')
      try {
        return await queryOneApiBalance(apiKey, url)
      } catch (oneApiError) {
        console.error('[OpenAI] OneAPI 兼容接口也失败了:', oneApiError.message)
        throw lastError || new Error('无法查询 OpenAI 余额，请检查：\n1. API Key 是否正确（以 sk- 开头）\n2. 是否使用了正确的 Base URL\n3. API Key 是否有查询余额的权限\n4. 如果是组织 Key，可能需要管理员权限\n\n提示：可以尝试使用"自定义"平台类型手动配置')
      }
    }
  },

  claude: {
    name: 'Claude (Anthropic)',
    color: '#d97706',
    icon: '🧠',
    baseUrl: 'https://api.anthropic.com',
    async queryBalance(apiKey, baseUrl) {
      // Anthropic 官方没有余额查询接口，尝试中转站兼容接口
      const url = baseUrl || this.baseUrl
      return await queryOneApiBalance(apiKey, url)
    }
  },

  gemini: {
    name: 'Google Gemini',
    color: '#4285f4',
    icon: '💎',
    baseUrl: 'https://generativelanguage.googleapis.com',
    async queryBalance(apiKey, baseUrl) {
      const url = baseUrl || this.baseUrl
      return await queryOneApiBalance(apiKey, url)
    }
  },

  deepseek: {
    name: 'DeepSeek',
    color: '#0066ff',
    icon: '🔍',
    baseUrl: 'https://api.deepseek.com',
    async queryBalance(apiKey, baseUrl) {
      const url = baseUrl || this.baseUrl
      const headers = { Authorization: `Bearer ${apiKey}` }

      try {
        const res = await fetch(`${url}/user/balance`, { headers })
        if (res.ok) {
          const data = await res.json()
          if (data.balance_infos) {
            const info = data.balance_infos[0] || {}
            const total = parseFloat(info.total_balance || 0)
            const granted = parseFloat(info.granted_balance || 0)
            const topped = parseFloat(info.topped_up_balance || 0)
            return {
              total: total,
              used: 0,
              remaining: total,
              currency: info.currency || 'CNY',
              expiresAt: null,
              detail: { granted, topped_up: topped }
            }
          }
        }
      } catch (e) { /* fallback */ }

      return await queryOneApiBalance(apiKey, url)
    }
  },

  siliconflow: {
    name: '硅基流动 (SiliconFlow)',
    color: '#ff6b35',
    icon: '🔥',
    baseUrl: 'https://api.siliconflow.cn',
    async queryBalance(apiKey, baseUrl) {
      const url = baseUrl || this.baseUrl
      const headers = { Authorization: `Bearer ${apiKey}` }

      let lastError = null

      try {
        // 尝试查询用户信息（包含余额）
        console.log('[SiliconFlow] 尝试查询用户信息...')
        const userInfoRes = await fetch(`${url}/v1/user/info`, { headers })
        console.log('[SiliconFlow] v1/user/info 响应状态:', userInfoRes.status)
        
        if (userInfoRes.ok) {
          const userInfo = await userInfoRes.json()
          console.log('[SiliconFlow] v1/user/info 完整响应数据:', JSON.stringify(userInfo, null, 2))
          
          // 尝试多种数据结构
          let balanceData = null
          
          // 情况1: userInfo.data
          if (userInfo.data) {
            balanceData = userInfo.data
            console.log('[SiliconFlow] 使用 userInfo.data')
          }
          // 情况2: userInfo 本身就是数据
          else if (userInfo.balance !== undefined || userInfo.total_quota !== undefined) {
            balanceData = userInfo
            console.log('[SiliconFlow] 使用 userInfo 本身')
          }
          
          if (balanceData) {
            console.log('[SiliconFlow] 解析到的余额数据:', JSON.stringify(balanceData, null, 2))
            
            // 尝试多种可能的余额字段名
            const balance = parseFloat(
              balanceData.balance ?? 
              balanceData.remaining ?? 
              balanceData.available_balance ?? 
              balanceData.current_balance ?? 
              0
            )
            
            const totalQuota = parseFloat(
              balanceData.total_quota ?? 
              balanceData.total_balance ?? 
              balanceData.total_amount ?? 
              balance
            )
            
            const usedQuota = parseFloat(
              balanceData.used_quota ?? 
              balanceData.used_balance ?? 
              balanceData.consumed_amount ?? 
              (totalQuota - balance)
            )
            
            console.log('[SiliconFlow] 解析结果 - balance:', balance, 'total:', totalQuota, 'used:', usedQuota)
            
            // 如果余额为 0，给出警告
            if (balance === 0 && totalQuota === 0) {
              console.warn('[SiliconFlow] ⚠️ 警告：查询到的余额为 0，可能是 API Key 权限不足或数据格式不匹配')
            }
            
            return {
              total: totalQuota,
              used: usedQuota,
              remaining: balance,
              currency: balanceData.currency || 'CNY',
              expiresAt: balanceData.quota_expired_at || balanceData.expire_time ? new Date((balanceData.quota_expired_at || balanceData.expire_time) * 1000).toLocaleDateString() : null,
              detail: {
                unit: balanceData.unit || '元',
                total_quota: balanceData.total_quota,
                used_quota: balanceData.used_quota,
                balance: balanceData.balance,
                user_name: balanceData.name,
                email: balanceData.email,
                raw_data: balanceData
              }
            }
          } else {
            console.warn('[SiliconFlow] 未找到有效的余额数据字段')
          }
        } else {
          const errorText = await userInfoRes.text()
          console.log('[SiliconFlow] v1/user/info 错误响应:', errorText)
          lastError = new Error(`API 返回错误 (${userInfoRes.status}): ${errorText}`)
        }
      } catch (e) {
        console.error('[SiliconFlow] v1/user/info 请求失败:', e.message)
        lastError = e
      }

      try {
        // 尝试新版余额查询接口
        console.log('[SiliconFlow] 尝试新版余额接口...')
        const balanceRes = await fetch(`${url}/v1/user/balance`, { headers })
        console.log('[SiliconFlow] v1/user/balance 响应状态:', balanceRes.status)
        
        if (balanceRes.ok) {
          const data = await balanceRes.json()
          console.log('[SiliconFlow] v1/user/balance 完整响应数据:', JSON.stringify(data, null, 2))
          
          let balanceData = null
          
          if (data.data) {
            balanceData = data.data
            console.log('[SiliconFlow] 使用 data.data')
          } else if (data.balance !== undefined) {
            balanceData = data
            console.log('[SiliconFlow] 使用 data 本身')
          }
          
          if (balanceData) {
            const balance = parseFloat(
              balanceData.balance ?? 
              balanceData.remaining ?? 
              balanceData.available_balance ?? 
              0
            )
            
            const totalQuota = parseFloat(
              balanceData.total_quota ?? 
              balanceData.total_balance ?? 
              balance
            )
            
            const usedQuota = parseFloat(
              balanceData.used_quota ?? 
              balanceData.used_balance ?? 
              (totalQuota - balance)
            )
            
            console.log('[SiliconFlow] 解析结果 - balance:', balance, 'total:', totalQuota, 'used:', usedQuota)
            
            return {
              total: totalQuota,
              used: usedQuota,
              remaining: balance,
              currency: balanceData.currency || 'CNY',
              expiresAt: balanceData.expired_at || balanceData.expire_time ? new Date((balanceData.expired_at || balanceData.expire_time) * 1000).toLocaleDateString() : null
            }
          }
        } else {
          const errorText = await balanceRes.text()
          console.log('[SiliconFlow] v1/user/balance 错误响应:', errorText)
        }
      } catch (e) {
        console.error('[SiliconFlow] v1/user/balance 请求失败:', e.message)
      }

      try {
        // 尝试计费查询接口
        console.log('[SiliconFlow] 尝试计费查询接口...')
        const billingRes = await fetch(`${url}/api/v1/billing/credit_grants`, { headers })
        console.log('[SiliconFlow] api/v1/billing/credit_grants 响应状态:', billingRes.status)
        
        if (billingRes.ok) {
          const data = await billingRes.json()
          console.log('[SiliconFlow] api/v1/billing/credit_grants 响应数据:', JSON.stringify(data, null, 2))
          
          if (data.total_available !== undefined || data.balance !== undefined) {
            return {
              total: data.total_granted || data.total_available || data.balance,
              used: data.total_used || 0,
              remaining: data.total_available ?? data.balance,
              currency: data.currency || 'CNY',
              expiresAt: null
            }
          }
        } else {
          const errorText = await billingRes.text()
          console.log('[SiliconFlow] api/v1/billing/credit_grants 错误响应:', errorText)
        }
      } catch (e) {
        console.error('[SiliconFlow] api/v1/billing/credit_grants 请求失败:', e.message)
      }

      // 最后尝试 OneAPI 兼容接口
      console.log('[SiliconFlow] 尝试 OneAPI 兼容接口...')
      try {
        return await queryOneApiBalance(apiKey, url)
      } catch (oneApiError) {
        console.error('[SiliconFlow] OneAPI 兼容接口也失败了:', oneApiError.message)
        throw lastError || new Error('无法查询硅基流动余额，请检查：\n1. API Key 是否正确\n2. 是否使用了正确的 Base URL\n3. API Key 是否有查询余额的权限\n\n提示：可以尝试使用"自定义"平台类型手动配置')
      }
    }
  },

  zhipuai: {
    name: '智谱AI (Zhipu)',
    color: '#3b82f6',
    icon: '🚀',
    baseUrl: 'https://open.bigmodel.cn',
    async queryBalance(apiKey, baseUrl) {
      const url = baseUrl || this.baseUrl
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }

      let lastError = null

      try {
        // 尝试查询账户余额
        console.log('[ZhipuAI] 尝试查询账户余额...')
        const res = await fetch(`${url}/api/paas/v4/balance`, { headers })
        console.log('[ZhipuAI] api/paas/v4/balance 响应状态:', res.status)
        
        if (res.ok) {
          const data = await res.json()
          console.log('[ZhipuAI] api/paas/v4/balance 响应数据:', JSON.stringify(data, null, 2))
          
          // 新版 API 格式
          if (data.data && data.data.balance !== undefined) {
            const balanceData = data.data
            return {
              total: balanceData.total_balance || balanceData.balance,
              used: balanceData.used_balance || 0,
              remaining: balanceData.balance,
              currency: 'CNY',
              expiresAt: balanceData.expire_time ? new Date(balanceData.expire_time).toLocaleDateString() : null,
              detail: {
                unit: '元',
                total_balance: balanceData.total_balance,
                used_balance: balanceData.used_balance,
                balance: balanceData.balance
              }
            }
          }
          
          // 旧版 API 格式
          if (data.balance !== undefined) {
            return {
              total: data.total_quota || data.balance,
              used: data.used_quota || 0,
              remaining: data.balance,
              currency: 'CNY',
              expiresAt: null
            }
          }
        } else {
          const errorText = await res.text()
          console.log('[ZhipuAI] api/paas/v4/balance 错误响应:', errorText)
          lastError = new Error(`API 返回错误 (${res.status}): ${errorText}`)
        }
      } catch (e) {
        console.error('[ZhipuAI] api/paas/v4/balance 请求失败:', e.message)
        lastError = e
      }

      try {
        // 尝试旧版余额接口
        console.log('[ZhipuAI] 尝试旧版余额接口...')
        const oldRes = await fetch(`${url}/api/llm/v1/account/balance`, { headers })
        console.log('[ZhipuAI] api/llm/v1/account/balance 响应状态:', oldRes.status)
        
        if (oldRes.ok) {
          const data = await oldRes.json()
          console.log('[ZhipuAI] api/llm/v1/account/balance 响应数据:', JSON.stringify(data, null, 2))
          
          if (data.data) {
            const balance = parseFloat(data.data.balance || 0)
            const total = parseFloat(data.data.total_quota || balance)
            const used = total - balance
            return {
              total: total,
              used: used,
              remaining: balance,
              currency: 'CNY',
              expiresAt: null,
              detail: {
                unit: data.data.unit || '元',
                total_quota: data.data.total_quota,
                balance: data.data.balance
              }
            }
          }
        } else {
          const errorText = await oldRes.text()
          console.log('[ZhipuAI] api/llm/v1/account/balance 错误响应:', errorText)
        }
      } catch (e) {
        console.error('[ZhipuAI] api/llm/v1/account/balance 请求失败:', e.message)
      }

      try {
        // 尝试查询用户信息
        console.log('[ZhipuAI] 尝试查询用户信息...')
        const userInfoRes = await fetch(`${url}/api/paas/v4/user/info`, { headers })
        console.log('[ZhipuAI] api/paas/v4/user/info 响应状态:', userInfoRes.status)
        
        if (userInfoRes.ok) {
          const userInfo = await userInfoRes.json()
          console.log('[ZhipuAI] api/paas/v4/user/info 响应数据:', JSON.stringify(userInfo, null, 2))
          
          if (userInfo.data && userInfo.data.balance !== undefined) {
            return {
              total: userInfo.data.total_quota || userInfo.data.balance,
              used: userInfo.data.used_quota || 0,
              remaining: userInfo.data.balance,
              currency: 'CNY',
              expiresAt: null
            }
          }
        } else {
          const errorText = await userInfoRes.text()
          console.log('[ZhipuAI] api/paas/v4/user/info 错误响应:', errorText)
        }
      } catch (e) {
        console.error('[ZhipuAI] api/paas/v4/user/info 请求失败:', e.message)
      }

      try {
        // 尝试另一个用户信息接口
        console.log('[ZhipuAI] 尝试另一个用户信息接口...')
        const userInfoRes2 = await fetch(`${url}/api/llm/v1/account/info`, { headers })
        console.log('[ZhipuAI] api/llm/v1/account/info 响应状态:', userInfoRes2.status)
        
        if (userInfoRes2.ok) {
          const userInfo = await userInfoRes2.json()
          console.log('[ZhipuAI] api/llm/v1/account/info 响应数据:', JSON.stringify(userInfo, null, 2))
          
          if (userInfo.data) {
            return {
              total: userInfo.data.total_quota || 0,
              used: userInfo.data.used_quota || 0,
              remaining: userInfo.data.quota || 0,
              currency: 'CNY',
              expiresAt: null,
              detail: {
                total_quota: userInfo.data.total_quota,
                used_quota: userInfo.data.used_quota,
                quota: userInfo.data.quota
              }
            }
          }
        } else {
          const errorText = await userInfoRes2.text()
          console.log('[ZhipuAI] api/llm/v1/account/info 错误响应:', errorText)
        }
      } catch (e) {
        console.error('[ZhipuAI] api/llm/v1/account/info 请求失败:', e.message)
      }

      // 最后尝试 OneAPI 兼容接口
      console.log('[ZhipuAI] 尝试 OneAPI 兼容接口...')
      try {
        return await queryOneApiBalance(apiKey, url)
      } catch (oneApiError) {
        console.error('[ZhipuAI] OneAPI 兼容接口也失败了:', oneApiError.message)
        throw lastError || new Error('无法查询智谱AI余额，请检查：\n1. API Key 是否正确（智谱AI的API Key通常以 . 开头）\n2. 是否使用了正确的 Base URL\n3. API Key 是否有查询余额的权限\n\n提示：可以尝试使用"自定义"平台类型手动配置')
      }
    }
  },

  openrouter: {
    name: 'OpenRouter',
    color: '#6c5ce7',
    icon: '🌐',
    baseUrl: 'https://openrouter.ai',
    async queryBalance(apiKey, baseUrl) {
      const url = baseUrl || this.baseUrl
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }

      let lastError = null

      try {
        // 查询用户信息（包含余额）
        console.log('[OpenRouter] 尝试查询用户信息...')
        const res = await fetch(`${url}/api/v1/auth/key`, { headers })
        console.log('[OpenRouter] api/v1/auth/key 响应状态:', res.status)
        
        if (res.ok) {
          const data = await res.json()
          console.log('[OpenRouter] api/v1/auth/key 响应数据:', JSON.stringify(data, null, 2))
          
          if (data.data && data.data.balance !== undefined) {
            const balanceData = data.data
            return {
              total: balanceData.total_balance || balanceData.balance,
              used: balanceData.used_balance || 0,
              remaining: balanceData.balance,
              currency: 'USD',
              expiresAt: balanceData.expires_at ? new Date(balanceData.expires_at * 1000).toLocaleDateString() : null,
              detail: {
                label: balanceData.label,
                created_at: balanceData.created_at
              }
            }
          } else if (data.balance !== undefined) {
            return {
              total: data.balance,
              used: 0,
              remaining: data.balance,
              currency: 'USD',
              expiresAt: null
            }
          }
        } else {
          const errorText = await res.text()
          console.log('[OpenRouter] api/v1/auth/key 错误响应:', errorText)
          lastError = new Error(`API 返回错误 (${res.status}): ${errorText}`)
        }
      } catch (e) {
        console.error('[OpenRouter] api/v1/auth/key 请求失败:', e.message)
        lastError = e
      }

      // 最后尝试 OneAPI 兼容接口
      console.log('[OpenRouter] 尝试 OneAPI 兼容接口...')
      try {
        return await queryOneApiBalance(apiKey, url)
      } catch (oneApiError) {
        console.error('[OpenRouter] OneAPI 兼容接口也失败了:', oneApiError.message)
        throw lastError || new Error('无法查询 OpenRouter 余额，请检查 API Key 是否正确')
      }
    }
  },

  minimax: {
    name: 'MiniMax',
    color: '#ff6b9d',
    icon: '🎭',
    baseUrl: 'https://api.minimax.chat',
    async queryBalance(apiKey, baseUrl) {
      const url = baseUrl || this.baseUrl
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }

      let lastError = null

      try {
        // 查询账户余额
        console.log('[MiniMax] 尝试查询账户余额...')
        const res = await fetch(`${url}/v1/account/balance`, { headers })
        console.log('[MiniMax] v1/account/balance 响应状态:', res.status)
        
        if (res.ok) {
          const data = await res.json()
          console.log('[MiniMax] v1/account/balance 响应数据:', JSON.stringify(data, null, 2))
          
          if (data.data && data.data.balance !== undefined) {
            const balanceData = data.data
            return {
              total: balanceData.total_balance || balanceData.balance,
              used: balanceData.used_balance || 0,
              remaining: balanceData.balance,
              currency: 'CNY',
              expiresAt: null,
              detail: {
                unit: '元',
                total_balance: balanceData.total_balance,
                used_balance: balanceData.used_balance
              }
            }
          } else if (data.balance !== undefined) {
            return {
              total: data.balance,
              used: 0,
              remaining: data.balance,
              currency: 'CNY',
              expiresAt: null
            }
          }
        } else {
          const errorText = await res.text()
          console.log('[MiniMax] v1/account/balance 错误响应:', errorText)
          lastError = new Error(`API 返回错误 (${res.status}): ${errorText}`)
        }
      } catch (e) {
        console.error('[MiniMax] v1/account/balance 请求失败:', e.message)
        lastError = e
      }

      // 最后尝试 OneAPI 兼容接口
      console.log('[MiniMax] 尝试 OneAPI 兼容接口...')
      try {
        return await queryOneApiBalance(apiKey, url)
      } catch (oneApiError) {
        console.error('[MiniMax] OneAPI 兼容接口也失败了:', oneApiError.message)
        throw lastError || new Error('无法查询 MiniMax 余额，请检查 API Key 是否正确')
      }
    }
  },

  github: {
    name: 'GitHub Copilot',
    color: '#24292e',
    icon: '🐙',
    baseUrl: 'https://api.github.com',
    async queryBalance(apiKey, baseUrl) {
      const url = baseUrl || this.baseUrl
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }

      let lastError = null

      try {
        // GitHub Copilot 没有公开的余额查询 API
        // 尝试查询用户信息来验证 API Key 有效性
        console.log('[GitHub] 尝试验证 API Key...')
        const res = await fetch(`${url}/user`, { headers })
        console.log('[GitHub] user 响应状态:', res.status)
        
        if (res.ok) {
          const userInfo = await res.json()
          console.log('[GitHub] user 响应数据:', JSON.stringify(userInfo, null, 2))
          
          // GitHub Copilot 是订阅制，没有传统意义上的余额
          // 返回一个提示信息
          return {
            total: 0,
            used: 0,
            remaining: 0,
            currency: 'USD',
            expiresAt: null,
            note: 'GitHub Copilot 为订阅制服务，无余额概念。API Key 验证成功！',
            detail: {
              login: userInfo.login,
              name: userInfo.name,
              email: userInfo.email
            }
          }
        } else {
          const errorText = await res.text()
          console.log('[GitHub] user 错误响应:', errorText)
          lastError = new Error(`API 返回错误 (${res.status}): ${errorText}`)
        }
      } catch (e) {
        console.error('[GitHub] user 请求失败:', e.message)
        lastError = e
      }

      throw lastError || new Error('无法验证 GitHub API Key，请检查是否正确')
    }
  },

  kimi: {
    name: 'Kimi (月之暗面)',
    color: '#6c5ce7',
    icon: '🌙',
    baseUrl: 'https://api.moonshot.cn',
    async queryBalance(apiKey, baseUrl) {
      const url = baseUrl || this.baseUrl
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }

      let lastError = null

      try {
        // 查询用户信息（包含余额）
        console.log('[Kimi] 尝试查询用户信息...')
        const res = await fetch(`${url}/v1/user/info`, { headers })
        console.log('[Kimi] v1/user/info 响应状态:', res.status)
        
        if (res.ok) {
          const data = await res.json()
          console.log('[Kimi] v1/user/info 响应数据:', JSON.stringify(data, null, 2))
          
          if (data.data && data.data.balance !== undefined) {
            const balanceData = data.data
            return {
              total: balanceData.total_balance || balanceData.balance,
              used: balanceData.used_balance || 0,
              remaining: balanceData.balance,
              currency: 'CNY',
              expiresAt: null,
              detail: {
                unit: '元',
                total_balance: balanceData.total_balance,
                used_balance: balanceData.used_balance
              }
            }
          } else if (data.balance !== undefined) {
            return {
              total: data.balance,
              used: 0,
              remaining: data.balance,
              currency: 'CNY',
              expiresAt: null
            }
          }
        } else {
          const errorText = await res.text()
          console.log('[Kimi] v1/user/info 错误响应:', errorText)
          lastError = new Error(`API 返回错误 (${res.status}): ${errorText}`)
        }
      } catch (e) {
        console.error('[Kimi] v1/user/info 请求失败:', e.message)
        lastError = e
      }

      // 最后尝试 OneAPI 兼容接口
      console.log('[Kimi] 尝试 OneAPI 兼容接口...')
      try {
        return await queryOneApiBalance(apiKey, url)
      } catch (oneApiError) {
        console.error('[Kimi] OneAPI 兼容接口也失败了:', oneApiError.message)
        throw lastError || new Error('无法查询 Kimi 余额，请检查 API Key 是否正确')
      }
    }
  },

  mimo: {
    name: 'Mimo (小米)',
    color: '#ff6900',
    icon: '📱',
    baseUrl: 'https://api.mimo.com',
    async queryBalance(apiKey, baseUrl) {
      const url = baseUrl || this.baseUrl
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }

      let lastError = null

      try {
        // 查询账户余额
        console.log('[Mimo] 尝试查询账户余额...')
        const res = await fetch(`${url}/v1/account/balance`, { headers })
        console.log('[Mimo] v1/account/balance 响应状态:', res.status)
        
        if (res.ok) {
          const data = await res.json()
          console.log('[Mimo] v1/account/balance 响应数据:', JSON.stringify(data, null, 2))
          
          if (data.data && data.data.balance !== undefined) {
            const balanceData = data.data
            return {
              total: balanceData.total_balance || balanceData.balance,
              used: balanceData.used_balance || 0,
              remaining: balanceData.balance,
              currency: 'CNY',
              expiresAt: null,
              detail: {
                unit: '元',
                total_balance: balanceData.total_balance,
                used_balance: balanceData.used_balance
              }
            }
          } else if (data.balance !== undefined) {
            return {
              total: data.balance,
              used: 0,
              remaining: data.balance,
              currency: 'CNY',
              expiresAt: null
            }
          }
        } else {
          const errorText = await res.text()
          console.log('[Mimo] v1/account/balance 错误响应:', errorText)
          lastError = new Error(`API 返回错误 (${res.status}): ${errorText}`)
        }
      } catch (e) {
        console.error('[Mimo] v1/account/balance 请求失败:', e.message)
        lastError = e
      }

      // 最后尝试 OneAPI 兼容接口
      console.log('[Mimo] 尝试 OneAPI 兼容接口...')
      try {
        return await queryOneApiBalance(apiKey, url)
      } catch (oneApiError) {
        console.error('[Mimo] OneAPI 兼容接口也失败了:', oneApiError.message)
        throw lastError || new Error('无法查询 Mimo 余额，请检查 API Key 是否正确')
      }
    }
  },

  custom: {
    name: '自定义 (兼容 One API)',
    color: '#8b5cf6',
    icon: '⚙️',
    baseUrl: '',
    async queryBalance(apiKey, baseUrl) {
      if (!baseUrl) throw new Error('自定义平台需要填写 Base URL')
      return await queryOneApiBalance(apiKey, baseUrl)
    }
  }
}

/**
 * 兼容 one-api / new-api 的余额查询
 */
async function queryOneApiBalance(apiKey, baseUrl) {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }

  // 尝试多种常见端点
  const endpoints = [
    '/api/user/dashboard',
    '/v1/dashboard/billing/subscription',
    '/api/user/self',
    '/api/status'
  ]

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, { headers })
      if (!res.ok) continue

      const data = await res.json()

      // 尝试解析
      if (data.data) {
        const d = data.data
        return {
          total: d.quota != null ? d.quota / 500000 : (d.total || 0),
          used: d.used_quota != null ? d.used_quota / 500000 : (d.used || 0),
          remaining: d.quota != null ? (d.quota - (d.used_quota || 0)) / 500000 : (d.remaining || 0),
          currency: 'USD',
          expiresAt: null
        }
      }

      if (data.hard_limit_usd != null) {
        return {
          total: data.hard_limit_usd,
          used: 0,
          remaining: data.hard_limit_usd,
          currency: 'USD',
          expiresAt: data.access_until ? new Date(data.access_until * 1000).toLocaleDateString() : null
        }
      }
    } catch (e) {
      continue
    }
  }

  throw new Error('无法查询余额，请检查 API Key 和 Base URL 是否正确')
}

function getStartDate() {
  const d = new Date()
  d.setDate(1)
  return d.toISOString().split('T')[0]
}

function getEndDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export { PROVIDERS }
export default PROVIDERS
