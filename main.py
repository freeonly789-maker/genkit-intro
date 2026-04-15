from typing import Optional
from pydantic import BaseModel, Field
from genkit import Genkit
from genkit.plugins.google_genai import GoogleAI

# Initialize Genkit with the Google AI plugin
ai = Genkit(
    plugins=[GoogleAI()],
    model='googleai/gemini-2.5-flash',
)

# Define input schema
class RecipeInput(BaseModel):
    ingredient: str = Field(description='Main ingredient or cuisine type')
    dietary_restrictions: Optional[str] = Field(default=None, description='Any dietary restrictions')

# Define output schema
class Recipe(BaseModel):
    title: str
    description: str
    prep_time: str
    cook_time: str
    servings: int
    ingredients: list[str]
    instructions: list[str]

# Define a recipe generator flow using ai.generate with proper message structure
@ai.flow()
async def recipe_generator_flow(input_data: RecipeInput) -> Recipe:
    """Generate a recipe based on ingredients and dietary restrictions."""
    
    # Create messages in the proper format with system and user content
    messages = [
        {
            'role': 'user',
            'content': [
                {
                    'text': f"""Create a recipe with the following requirements:
Main ingredient: {input_data.ingredient}
Dietary restrictions: {input_data.dietary_restrictions or 'none'}

Return the recipe as JSON."""
                }
            ]
        }
    ]

    # Generate structured recipe data using the latest Genkit v0.5 API
    result = await ai.generate(
        messages=messages,
        output_schema=Recipe,
        config={'temperature': 0.7}
    )

    if not result.output:
        raise ValueError('Failed to generate recipe')

    return result.output

async def main() -> None:
    # Run the flow
    recipe = await recipe_generator_flow(RecipeInput(
        ingredient='avocado',
        dietary_restrictions='vegetarian'
    ))

    # Print the structured recipe
    print(recipe.model_dump_json(indent=2))

if __name__ == "__main__":
    ai.run_main(main())
