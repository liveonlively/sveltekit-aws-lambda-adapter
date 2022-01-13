const lambda_code = require('./test-app/build/lambda/index.js');
lambda_code
	.handler({
		version: '2.0',
		routeKey: 'ANY /',
		rawPath: '/',
		rawQueryString: '',
		cookies: [
			'CognitoIdentityServiceProvider.4sjnpggfg489352ldo6n51jtk0.LastAuthUser=rob@golive.ly',
			'CognitoIdentityServiceProvider.4sjnpggfg489352ldo6n51jtk0.rob@golive.ly.clockDrift=0',
			'CognitoIdentityServiceProvider.4sjnpggfg489352ldo6n51jtk0.rob@golive.ly.idToken=eyJraWQiOiJEa3Q2dDFsenpwWklNNkFJbjRlcWlVRjlWVlhCa05sMXBiMVFkSG1COERNPSIsImFsZyI6IlJTMjU2In0.eyJjdXN0b206dXVpZCI6InJvYiIsInN1YiI6IjQzYWZmNDY1LTQzYTEtNDZiZi04OWZkLTg0NWEyZDYyMDE5MSIsInpvbmVpbmZvIjoiQW1lcmljYVwvTmV3X1lvcmsiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfRUhWYWF6UDBUIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6IjQzYWZmNDY1LTQzYTEtNDZiZi04OWZkLTg0NWEyZDYyMDE5MSIsImdpdmVuX25hbWUiOiJSb2IiLCJvcmlnaW5fanRpIjoiN2ZlMTZkMDctYjAxNC00OTk3LTg0NDMtYjExNGFlMTAzNGIyIiwiYXVkIjoiNHNqbnBnZ2ZnNDg5MzUybGRvNm41MWp0azAiLCJldmVudF9pZCI6ImU2NmE5YzU3LWYzMTktNDZkNi05YjYyLTQ5YzA1ZjU1MDMzNCIsInVwZGF0ZWRfYXQiOjE2Mjk3ODI3MjUsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjM5NzEyOTU4LCJwaG9uZV9udW1iZXIiOiIrMTcxODkzODkzNzQiLCJleHAiOjE2NDE0OTcyOTgsImlhdCI6MTY0MTQ5MzY5OCwiZmFtaWx5X25hbWUiOiJNYXJzY2hlciIsImp0aSI6IjA1MjNjOWM5LWJmYjMtNDk3NS1hZTgyLWRlODY2ZGVkZjMxYSIsImVtYWlsIjoicm9iQGdvbGl2ZS5seSJ9.PNetRruRrPkJUb3LawPvFI0UFKw34oE94dmNUeKLccTnijnRqmYQyKk4hO_dAEJc42tULBsfQlUsaj0EsNi-kZlkH436PByEpo_CpjG-FY6OMUPvooWX8Ggqxd2GqIs9oVTCIDJxB1zwpUKlzC12fAHqQfAUMOtehQ3G2yIKC7-5h4Pr3l0i6hMnxln6aKWr_iT0Xh4zQojFfe7CpooRcqTsbIViWlFuc6-A2-lrTiZohW1a7Pu1rP29n01O2GCgNmWTl3ksRc0tBYEu-ggn4DyXzQ5hzbka_Mi61ogwncAzE5Vxcpk3s_d5iQXqOW3CPgiQqVS5fhu6-MbuqCUi4g',
			'CognitoIdentityServiceProvider.4sjnpggfg489352ldo6n51jtk0.rob@golive.ly.refreshToken=eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.OoiDYpbOtr9V1Z-wGGM8UMHdTBiHx2rFiXw-f2a95mN0FlV_agckWkIB5MDFGuFtUj_VrFheG8T1d5w8kVWuHMvbDfHBFiiLs1dk5ErgyWMcl12XG-1SYnN6KWjn5pPxxuvLQrqpHVK7eNCtn5ptNmYK9zR8wbOpOWrlkhkUHOl2TbLdAzXPeQLrGzYLWWHkC_51Pzktx1DKhszJxWYWyjuDkAVzVIxhqhB_k-8b43ctDUPjZEWXSCN0Npf95IFLOBmNLaawPDL9r2puyp1ZlIIgAw3k5nbe8StbfMvlO5nKV2u1efbRV4yGKcaJ1Tnuy6SkVDYEkVaB5sDsWTWPKA.eij2LlXONPdlQyw4.MhD1DJyNpDte0EiTFcJxCMbgQJENtRwi_9V9CWICbJSmrrXh8t2yQjdRmX3TLfrmvWoEsXsJsR03G3ERMN0cZs80_toSGY_9MhC-X-a3FuzysaD7lJeHeIYD9pGttetIhnNWHzSuWRrvn4Q21EqKjT-w6_QKHBMGnibxHGqcuFkWSP0hytNFlxCX0MXZ16Gjuz6gIAbpm8AmS3kjN5H9uwyxlNw96Xs8qCs0vFHSQUsk0I3LEKaR2kYbPR01GmmcQUTN7x6Q8RWH6xOS9atP4-qOor0juj6_M7e0awV3NdRgkBaPcmlb6PsNV5YFeVckpcQW0BD0Zpe9z7gl5Vk8ROZBmLwEnz-OjC8u3MlAdXByag2TcyTn11o_p8rNn534gvwY1Ies_M8_JEVJQZX3Q9lOrFUOWA32ZMychLL9t2Uk02pBfgH2YOdCbNzZ7oO-Lr11PxOez12_AT8kUP_lI9JjYelhoyqckOCeNuaHEVqHw9SmvczrSeeXkhJfKGY7ZGA9O7K0wit8wpxZ9lOPfdm7bD2KR5zgkDb6aC_lTy9uy8p94KIxpLAemPQGv55GGnYucP80u8E59DbZP4vzhmqlPs9XzssQRgu8aJYVfeIBdSR2buJxJeoeeTRstzIIOVMVAR7J-jZILMrEsVBlNJPXhOmmM3G0cTAqJCEz8H5K1KiuTaMYC2cH_L7ftChSt7P1VQE7cya3kD3onZkBerbKHBi2tr8_WyB5v6pPgTdXU96k_ap7ORMMTWEShKTE_A73PDDuJdyFlt0vKABiI15oDE8HOlHjDIGg5qWf-QO7DLvJKzzRPJojkhfbyhv5NYX7VHjQteY_44TRGqwwznVUCMAzRcCWr9sg-8UBdetXAvJSRPTC4NUPQlvCVoVm5X9XtPmvQZlnfHTK6NM7eDAcmPYpmlaE90fql69jfwq9TqUNZLZRQU3t4uf9HvHvUZ-3SVKuaGz1ngEWkTHO9ZD_TirYLNRzvTNH7HWIXsNM7AtE2t7ec5qV2B1VnrT27nIvVHCjfqzu-TohoFPmOr0Mqywarluy_MzEsfa5TnxrRcusVStfgdGGjMymkFDGRC2RfmrQfZFYGOzd4H66zs6OWMYwJc12GOlgG3pjoPRQ7lrYwaFI64dhOtclqAvClpI3QrG6AJhxOEyWTAQAiraKkILhdoqm1peBD2-W3ffVDa5p-HX4X56CwEM9jki3B3H1FNgSz2S2z0OaAbaBaNfiL6hEFW06WzEWCNpAwLP8PdsY8pnq-t7zJUwKqFiSurE950uZxbTMgC9J8xCX5JQI4XOaKHMePqq3t0Oh5yn5apNENh60HUIwFQ.mnMQGcUd6eQq7I--m5uSBg',
			'amplify-signin-with-hostedUI=false',
			'amplify-signin-with-hostedUI=false',
		],
		headers: {
			'cache-control': 'max-age=0',
			'content-length': '0',
			host: '4hhl1ylyyd.execute-api.us-east-1.amazonaws.com',
			'user-agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
			via: '2.0 a3553fd14d7dc73d33a5426ee64abf1c.cloudfront.net (CloudFront)',
			'x-amz-cf-id': 'QEqGrbO-N_p3RTf2IeBxDcO3wZihfdFa8dHhWrNvogZla7Zd4RRZ9A==',
			'x-amzn-trace-id': 'Root=1-61dbc98c-100b3f3e4d3d402c1f3e531d',
			'x-forwarded-for': '74.103.156.82, 64.252.68.237',
			'x-forwarded-port': '443',
			'x-forwarded-proto': 'https',
		},
		requestContext: {
			accountId: '690422187866',
			apiId: '4hhl1ylyyd',
			domainName: '4hhl1ylyyd.execute-api.us-east-1.amazonaws.com',
			domainPrefix: '4hhl1ylyyd',
			http: {
				method: 'GET',
				path: '/',
				protocol: 'HTTP/1.1',
				sourceIp: '74.103.156.82',
				userAgent:
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
			},
			requestId: 'LtxuCg6iIAMEV2A=',
			routeKey: 'ANY /',
			stage: '$default',
			time: '10/Jan/2022:05:52:12 +0000',
			timeEpoch: 1641793932846,
		},
		isBase64Encoded: false,
	})
	.then((result) => {
		console.log('done');
		console.log(result);
	})
	.catch((err) => {
		console.log('ERROR -- ');
		console.error(err);
	});
