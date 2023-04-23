import { normalizeDuplicatedLocalizationErrorMessage } from 'src/commons/helpers/normalizeErrorMessages';

describe('SRC :: COMMONS : HELPERS :: NORMALIZE ERROR MESSAGES', () => {
  describe('Givne call to #normalizeDuplicatedLocalizationErrorMessage', () => {
    describe('When the IP_SEARCH_WINDOW_MINUTES value is greater than 1 minute', () => {
      test('Then you must return the message with the word minute in the plural', () => {
        const normalizedDuplicatedLocalizationErrorMessage =
          normalizeDuplicatedLocalizationErrorMessage('123:asdb', 2);

        expect(normalizedDuplicatedLocalizationErrorMessage).toStrictEqual(
          'The client and IP address 123:asdb combination has already been localized within the past 2 minutes. Please wait before localizing again.',
        );
      });
    });

    describe('When the IP_SEARCH_WINDOW_MINUTES value is less than 1 minute', () => {
      test('Then you must return the message with the word minute in the singular', () => {
        const normalizedDuplicatedLocalizationErrorMessage =
          normalizeDuplicatedLocalizationErrorMessage('123:asdb', 1);

        expect(normalizedDuplicatedLocalizationErrorMessage).toStrictEqual(
          'The client and IP address 123:asdb combination has already been localized within the past 1 minute. Please wait before localizing again.',
        );
      });
    });
  });
});
