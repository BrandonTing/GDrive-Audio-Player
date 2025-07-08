import { GlobalRegistrator } from '@happy-dom/global-registrator';
import * as matchers from '@testing-library/jest-dom/matchers';
import { afterAll, afterEach, beforeAll, expect } from 'bun:test';
import { server } from './msw-setup';

expect.extend(matchers);

GlobalRegistrator.register(); // Add this back

// Start MSW server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Stop MSW server after all tests
afterAll(() => server.close());
