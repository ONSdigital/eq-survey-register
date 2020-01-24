module.exports = () => {
  const mockSchema = {
    eq_id: "ea319193-4d95-4e8d-b236-1b3b5ca763d9",
    form_type: "ea319193-4d95-4e8d-b236-1b3b5ca763d9",
    mime_type: "application/json/ons/eq",
    schema_version: "0.0.1",
    data_version: "0.0.2",
    survey_id: "joshextest",
    title: "Josh Ex Test",
    sections: [
      {
        id: "section653ba4b7-576a-4a0d-8838-e5e2c9a72bf6",
        groups: [
          {
            id: "group653ba4b7-576a-4a0d-8838-e5e2c9a72bf6",
            title: "",
            blocks: [
              {
                type: "Introduction",
                id: "introduction-block",
                primary_content: [
                  {
                    type: "Basic",
                    id: "primary",
                    content: [
                      {
                        list: [
                          "Data should relate to all sites in England, Scotland, Wales and Northern Ireland unless otherwise stated.",
                          "You can provide info estimates if actual figures aren&#x2019;t available.",
                          "We will treat your data securely and confidentially."
                        ]
                      }
                    ]
                  }
                ],
                preview_content: {
                  id: "preview",
                  title: "Information you need",
                  content: [
                    {
                      description: "You can select the dates of the period you are reporting for, if the given dates are not appropriate."
                    }
                  ],
                  questions: []
                },
                secondary_content: [
                  {
                    id: "secondary-content",
                    title: "How we use your data",
                    content: [
                      {
                        list: [
                          "You cannot appeal your selection. Your business was selected to give us a comprehensive view of the UK economy.",
                          "The information you provide contributes to Gross Domestic Product (GDP)."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: "blockd1dfeb5e-65a4-44bf-aa04-2379c37fcc21",
                type: "Question",
                questions: [
                  {
                    id: "questiond1dfeb5e-65a4-44bf-aa04-2379c37fcc21",
                    title: "Menu Choice",
                    type: "General",
                    answers: [
                      {
                        id: "answer7b877a6c-2542-40b0-b47e-d7c0a2314561",
                        mandatory: false,
                        type: "Checkbox",
                        label: "Choose sides with Chilli",
                        description: "",
                        options: [
                          {
                            label: "Garlic Bread",
                            value: "Garlic Bread"
                          },
                          {
                            label: "Onion Rings",
                            value: "Onion Rings"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: "confirmation-group",
            title: "confirmation",
            blocks: [
              {
                title: "You are now ready to submit this survey",
                type: "Confirmation",
                id: "confirmation",
                description: "",
                questions: [
                  {
                    id: "ready-to-submit-completed-question",
                    title: "Submission",
                    type: "Content",
                    guidance: {
                      content: [
                        {
                          list: [
                            "You will not be able to access or change your answers on submitting the questionnaire",
                            "If you wish to review your answers please select the relevant completed sections"
                          ]
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    theme: "default",
    legal_basis: "Notice is given under section 1 of the Statistics of Trade Act 1947.",
    navigation: {
      visible: false
    },
    metadata: [
      {
        name: "user_id",
        validator: "string"
      },
      {
        name: "period_id",
        validator: "string"
      },
      {
        name: "ru_name",
        validator: "string"
      },
      {
        name: "trad_as",
        validator: "string"
      },
      {
        name: "ref_p_start_date",
        validator: "date"
      },
      {
        name: "ref_p_end_date",
        validator: "date"
      },
      {
        name: "employmentDate",
        validator: "date"
      }
    ],
    view_submitted_response: {
      enabled: true,
      duration: 900
    }
  }
  return mockSchema
}
