// Code generated by mockery v1.0.0
package cache

import mock "github.com/stretchr/testify/mock"

// MockType is an autogenerated mock type for the Type type
type MockType struct {
	mock.Mock
}

// Fetch provides a mock function with given fields: _a0, _a1
func (_m *MockType) Fetch(_a0 FetchOptions, _a1 Request) (FetchResult, error) {
	ret := _m.Called(_a0, _a1)

	var r0 FetchResult
	if rf, ok := ret.Get(0).(func(FetchOptions, Request) FetchResult); ok {
		r0 = rf(_a0, _a1)
	} else {
		r0 = ret.Get(0).(FetchResult)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(FetchOptions, Request) error); ok {
		r1 = rf(_a0, _a1)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}
