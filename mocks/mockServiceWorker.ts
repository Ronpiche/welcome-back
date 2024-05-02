import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import MOCK_RESPONSE from '@mocks/data.json';

const handlers = [
  http.get('http://localhost:3337/v1.0/users', () => {
    return HttpResponse.json(MOCK_RESPONSE.microsoft.users);
  }),
  http.get('http://localhost:3337/v1.0/users/:id', () => {
    return HttpResponse.json(MOCK_RESPONSE.microsoft.users.value[1]);
  }),
];

export default setupServer(...handlers);
